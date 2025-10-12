import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SajuType } from '@prisma/client';
import { Config } from '../config/config.schema';
import { ScoreService } from './score.service';
import { OpenAIService } from './openai.service';
import { PrismaService } from './prisma.service';
import {
  DailySajuInput,
  DailySajuResult,
  DailySajuResultSchema,
  DailySajuOpenAIResponseSchema,
} from './types/daily-saju.type';

@Injectable()
export class DailySajuService {
  static version = 1.0;

  private systemMsg: Config['openai']['system_message']['daily'];

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
    private readonly scoreService: ScoreService,
    private readonly config: ConfigService<Config, true>,
  ) {
    this.systemMsg =
      this.config.get<Config['openai']>('openai').system_message.daily;
  }

  async readSaju(input: DailySajuInput): Promise<DailySajuResult> {
    const score = this.scoreService.generateScore();
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
      999,
    );
    const existing = await this.prisma.sajuRecord.findFirst({
      where: {
        userPublicID: input.userId,
        type: SajuType.DAILY_NORMAL,
        version: DailySajuService.version,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If existing record found, return it
    if (existing) {
      const parsed = await DailySajuResultSchema.parseAsync(
        existing.data,
      ).catch((err) => {
        Logger.error(err, 'DailySajuService');
        throw new InternalServerErrorException('Failed to parse response');
      });

      return parsed;
    }

    // If existing record not found, create a new one
    const response = await this.openai.createStructuredCompletion({
      messages: [
        {
          role: 'system',
          content: this.systemMsg.all,
        },
        {
          role: 'user',
          content: JSON.stringify({
            ...input,
            score,
          }),
        },
      ],
      schema: DailySajuOpenAIResponseSchema,
      schemaName: 'DailySajuResponse',
    });

    const targetData: DailySajuResult = {
      name: input.userName,
      gender: input.gender,
      fortuneScore: score,
      relationship: response.relationship,
      health: response.health,
      romantic: response.romantic,
      totalFortuneMessage: response.totalFortuneMessage,
      todayShortMessage: response.todayShortMessage,
      wealth: response.wealth,
      caution: response.caution,
      birthDateTime: input.birthDateTime,
      questionAnswer: input.question ? response.questionAnswer : null,
    };
    const parsed = await DailySajuResultSchema.parseAsync(targetData).catch(
      (err) => {
        Logger.error(err, 'DailySajuService');
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    // Save the result to the database
    await this.prisma.sajuRecord.create({
      data: {
        userPublicID: input.userId,
        type: SajuType.DAILY_NORMAL,
        version: DailySajuService.version,
        data: parsed,
      },
    });

    return parsed;
  }
}
