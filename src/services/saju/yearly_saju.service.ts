import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import {
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
  YearlySajuResponse,
  YearlySajuResponseSchema,
} from 'src/schemas/saju/yearly_saju.schema';
import { PrismaService } from '../prisma.service';
import { LatestSaju, SajuType } from '@prisma';

@Injectable()
export class YearlySajuService {
  static version = 1.0;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingYearlySaju(
    userUuid: string,
  ): Promise<YearlySajuResponse | null> {
    const lastSaju = await this.prisma.latestSaju.findFirst({
      where: {
        userID: userUuid,
        type: SajuType.YEARLY,
        version: YearlySajuService.version,
        updatedAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
          lte: new Date(
            new Date().setFullYear(new Date().getFullYear(), 11, 31),
          ),
        },
      },
    });
    if (!lastSaju) {
      return null;
    }
    const parsed = await YearlySajuResponseSchema.parseAsync(
      lastSaju.data,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsed;
  }

  async getYearlySaju(request: YearlySajuRequest): Promise<YearlySajuResponse> {
    const respone = await this.openai.getYearlySaju(request);

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: YearlySajuResponse = {
      name: 'John Doe',
      birthDateTime: request.birthDateTime,
      gender: request.gender,
      ...parsed,
    };

    const parsedResult = await YearlySajuResponseSchema.parseAsync(
      result,
    ).catch((err) => {
      Logger.error(err, 'YearlySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsedResult;
  }

  async saveYearlySaju(data: {
    data: YearlySajuResponse;
    userUuid: string;
  }): Promise<LatestSaju> {
    return this.prisma.latestSaju.upsert({
      where: {
        userID_type: {
          userID: data.userUuid,
          type: SajuType.YEARLY,
        },
      },
      create: {
        userID: data.userUuid,
        type: SajuType.YEARLY,
        version: YearlySajuService.version,
        data: data.data,
      },
      update: {
        data: data.data,
      },
    });
  }
}
