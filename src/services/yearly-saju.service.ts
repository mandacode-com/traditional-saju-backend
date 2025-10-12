import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SajuType } from '@prisma/client';
import { Config } from '../config/config.schema';
import { OpenAIService } from './openai.service';
import { PrismaService } from './prisma.service';
import {
  YearlySajuInput,
  YearlySajuOpenAIResponse,
  YearlySajuOpenAIResponseSchema,
  YearlySajuResult,
  YearlySajuResultSchema,
} from './types/yearly-saju.type';

@Injectable()
export class YearlySajuService {
  static version = 1.0;

  private yearlyConfig: Config['openai']['system_message']['yearly'];

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Config, true>,
  ) {
    this.yearlyConfig =
      this.config.get<Config['openai']>('openai').system_message.yearly;
  }

  async readSaju(request: YearlySajuInput): Promise<YearlySajuResult> {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const existing = await this.prisma.sajuRecord.findFirst({
      where: {
        userPublicID: request.userId,
        type: SajuType.NEW_YEAR,
        version: YearlySajuService.version,
        createdAt: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If existing record found, return it
    if (existing) {
      const parsed = await YearlySajuResultSchema.parseAsync(
        existing.data,
      ).catch((err) => {
        Logger.error(err, 'YearlySajuService');
        throw new InternalServerErrorException('Failed to parse response');
      });

      return parsed;
    }

    // If existing record not found, create a new one
    // Step 1: Generate chart
    const chart = await this.openai.createStructuredCompletion({
      messages: [
        {
          role: 'system',
          content: this.yearlyConfig.chart,
        },
        {
          role: 'user',
          content: JSON.stringify(request),
        },
      ],
      schema: YearlySajuOpenAIResponseSchema.shape.chart,
      schemaName: 'YearlySajuChart',
    });

    // Handle birth time disabled
    if (request.birthTimeDisabled) {
      chart.earthly.branches.hour = null;
      chart.earthly.fiveElements.hour = null;
      chart.heavenly.stems.hour = null;
      chart.heavenly.fiveElements.hour = null;
    }

    const userChartInfo = {
      user: {
        datingStatus: request.datingStatus,
        birthDateTime: request.birthDateTime,
        gender: request.gender,
        jobStatus: request.jobStatus,
      },
      chart,
    };

    // Step 2: Generate all descriptions in parallel
    const descriptions = await this.openai.createMultipleCompletions([
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.general },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.relationship },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.wealth },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.romantic },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.health },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.career },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.waysToImprove },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.caution },
          { role: 'user', content: JSON.stringify(userChartInfo) },
        ],
      },
      {
        messages: [
          { role: 'system', content: this.yearlyConfig.questionAnswer },
          {
            role: 'user',
            content: JSON.stringify({
              ...userChartInfo,
              question: request.question,
            }),
          },
        ],
      },
    ]);

    const [
      general,
      relationship,
      wealth,
      romantic,
      health,
      career,
      waysToImprove,
      caution,
      questionAnswer,
    ] = descriptions;

    const response: YearlySajuOpenAIResponse = {
      chart,
      description: {
        general,
        relationship,
        wealth,
        romantic,
        health,
        career,
        waysToImprove,
        caution,
        questionAnswer: request.question ? questionAnswer : null,
      },
    };

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      response,
    ).catch((err) => {
      Logger.error(err, 'YearlySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: YearlySajuResult = {
      name: request.userName,
      birthDateTime: request.birthDateTime,
      gender: request.gender,
      ...parsed,
    };

    const parsedResult = await YearlySajuResultSchema.parseAsync(result).catch(
      (err) => {
        Logger.error(err, 'YearlySajuService');
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    // Save the result to the database
    await this.prisma.sajuRecord.create({
      data: {
        userPublicID: request.userId,
        type: SajuType.NEW_YEAR,
        version: YearlySajuService.version,
        data: parsedResult,
      },
    });

    return parsedResult;
  }
}
