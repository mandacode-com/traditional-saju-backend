import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SajuRecord, SajuType } from '@prisma/client';
import { Config } from '../config/config.schema';
import { ScoreService } from './score.service';
import { OpenAIService } from './openai.service';
import { PrismaService } from './prisma.service';
import {
  DailySajuRequest,
  DailySajuResponse,
  DailySajuResponseSchema,
  DailySajuOpenAIResponseSchema,
} from './types/daily-saju.type';

@Injectable()
export class DailySajuService {
  static version = 1.0;

  private dailyConfig: Config['openai']['system_message']['daily'];

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
    private readonly scoreService: ScoreService,
    private readonly config: ConfigService<Config, true>,
  ) {
    this.dailyConfig =
      this.config.get<Config['openai']>('openai').system_message.daily;
  }

  async getExistingData(userUuid: string): Promise<DailySajuResponse | null> {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    const lastSaju = await this.prisma.sajuRecord.findFirst({
      where: {
        user: {
          publicID: userUuid,
        },
        type: SajuType.DAILY_NORMAL,
        version: DailySajuService.version,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      orderBy: {
        createdAt: 'desc',
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
    const score = this.scoreService.generateScore();

    const response = await this.openai.createStructuredCompletion({
      messages: [
        {
          role: 'system',
          content: this.dailyConfig.all,
        },
        {
          role: 'user',
          content: JSON.stringify({
            ...request,
            score,
          }),
        },
      ],
      schema: DailySajuOpenAIResponseSchema.omit({ fortuneScore: true }),
      schemaName: 'DailySajuResponse',
    });

    const parsed = await DailySajuOpenAIResponseSchema.parseAsync({
      ...response,
      fortuneScore: score,
    }).catch((err) => {
      Logger.error(err, 'DailySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: DailySajuResponse = {
      name: 'John Doe',
      birthDateTime: request.birthDateTime,
      gender: request.gender,
      ...parsed,
      questionAnswer: request.question ? parsed.questionAnswer : undefined,
    };

    const parsedResult = await DailySajuResponseSchema.parseAsync(result).catch(
      (err) => {
        throw new InternalServerErrorException(err);
      },
    );

    return parsedResult;
  }

  async saveDailySaju(data: {
    result: DailySajuResponse;
    userUuid: string;
  }): Promise<SajuRecord> {
    return this.prisma.sajuRecord.create({
      data: {
        user: {
          connect: {
            publicID: data.userUuid,
          },
        },
        type: SajuType.DAILY_NORMAL,
        version: DailySajuService.version,
        data: data.result,
      },
    });
  }
}
