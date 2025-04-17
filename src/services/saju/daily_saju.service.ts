import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OpenAIService } from '../openai.service';
import {
  DailySajuOpenAIResponseSchema,
  DailySajuRequest,
  DailySajuResponse,
  DailySajuResponseSchema,
} from 'src/schemas/saju/daily_saju.schema';
import { PrismaService } from '../prisma.service';
import { LastSaju, SajuType } from '@prisma/client';

@Injectable()
export class DailySajuService {
  static version = 1.0;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingDailySaju(data: {
    userUuid: string;
  }): Promise<DailySajuResponse | null> {
    const lastSaju = await this.prisma.lastSaju.findFirst({
      where: {
        user: {
          uuid: data.userUuid,
        },
        type: SajuType.DAILY,
        version: DailySajuService.version,
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    if (!lastSaju) {
      return null;
    }
    const parsed = await DailySajuResponseSchema.parseAsync(
      lastSaju.data,
    ).catch((err) => {
      Logger.error(err, 'DailySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsed;
  }

  async getDailySaju(data: {
    request: DailySajuRequest;
  }): Promise<DailySajuResponse> {
    const respone = await this.openai.getDailySaju(data.request);

    const parsed = await DailySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((err) => {
      Logger.error(err, 'DailySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: DailySajuResponse = {
      name: 'John Doe',
      birthDateTime: data.request.birthDateTime,
      gender: data.request.gender,
      ...parsed,
    };

    const parsedResult = await DailySajuResponseSchema.parseAsync(result).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    return parsedResult;
  }

  async saveDailySaju(data: {
    data: DailySajuResponse;
    userUuid: string;
  }): Promise<LastSaju> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: data.userUuid,
      },
    });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    return this.prisma.lastSaju.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: SajuType.DAILY,
        },
      },
      create: {
        user: {
          connect: {
            uuid: data.userUuid,
          },
        },
        type: SajuType.DAILY,
        version: DailySajuService.version,
        data: data.data,
      },
      update: {
        data: data.data,
      },
    });
  }
}
