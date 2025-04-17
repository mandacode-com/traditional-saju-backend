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
import { SajuType } from '@prisma/client';

@Injectable()
export class YearlySajuService {
  static version = 1.0;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingYearlySaju(data: {
    userUuid: string;
  }): Promise<YearlySajuResponse | null> {
    const lastSaju = await this.prisma.lastSaju.findFirst({
      where: {
        user: {
          uuid: data.userUuid,
        },
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

  async getYearlySaju(data: {
    request: YearlySajuRequest;
  }): Promise<YearlySajuResponse> {
    const respone = await this.openai.getYearlySaju(data.request);

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: YearlySajuResponse = {
      name: 'John Doe',
      birthDateTime: data.request.birthDateTime,
      gender: data.request.gender,
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
  }): Promise<YearlySajuResponse> {
    const parsed = await YearlySajuResponseSchema.parseAsync(data.data).catch(
      (err) => {
        Logger.error(err, 'YearlySajuService');
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    const lastSaju = await this.prisma.lastSaju.create({
      data: {
        type: SajuType.YEARLY,
        version: YearlySajuService.version,
        user: {
          connect: {
            uuid: data.userUuid,
          },
        },
        data: parsed,
      },
    });

    if (!lastSaju) {
      throw new InternalServerErrorException('Failed to save response');
    }

    return parsed;
  }
}
