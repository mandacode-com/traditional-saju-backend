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
import { LatestSaju, SajuType } from '@prisma/client';

@Injectable()
export class DailySajuService {
  static version = 1.0;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingData(userUuid: string): Promise<DailySajuResponse | null> {
    const lastSaju = await this.prisma.latestSaju.findUnique({
      where: {
        userUuid_type: {
          userUuid: userUuid,
          type: SajuType.DAILY,
        },
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

  /**
   * Reads the daily saju from OpenAI and parses the response.
   * @param data - DailySajuRequest
   * @returns DailySajuResponse
   */
  async readSaju(request: DailySajuRequest): Promise<DailySajuResponse> {
    const respone = await this.openai.getDailySaju(request);

    const parsed = await DailySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((err) => {
      Logger.error(err, 'DailySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: DailySajuResponse = {
      name: 'John Doe',
      birthDateTime: request.birthDateTime,
      gender: request.gender,
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
    result: DailySajuResponse;
    userUuid: string;
  }): Promise<LatestSaju> {
    return this.prisma.latestSaju.upsert({
      where: {
        userUuid_type: {
          userUuid: data.userUuid,
          type: SajuType.DAILY,
        },
      },
      create: {
        userUuid: data.userUuid,
        type: SajuType.DAILY,
        version: DailySajuService.version,
        data: data.result,
      },
      update: {
        data: data.result,
      },
    });
  }
}
