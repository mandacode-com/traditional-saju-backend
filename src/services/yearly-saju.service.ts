import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SajuRecord, SajuType } from '@prisma/client';
import { Config } from '../config/config.schema';
import { OpenAIService } from './openai.service';
import { PrismaService } from './prisma.service';
import {
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
  YearlySajuResponse,
  YearlySajuResponseSchema,
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

  async getExistingYearlySaju(
    userUuid: string,
  ): Promise<YearlySajuResponse | null> {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const lastSaju = await this.prisma.sajuRecord.findFirst({
      where: {
        user: {
          publicID: userUuid,
        },
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

    if (!lastSaju) {
      return null;
    }

    const parsed = await YearlySajuResponseSchema.parseAsync(
      lastSaju.data,
    ).catch((err) => {
      Logger.error(err, 'YearlySajuService');
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsed;
  }

  async getYearlySaju(request: YearlySajuRequest): Promise<YearlySajuResponse> {
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
      chart.earthly.branches.hour = undefined;
      chart.earthly.fiveElements.hour = undefined;
      chart.heavenly.stems.hour = undefined;
      chart.heavenly.fiveElements.hour = undefined;
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
        questionAnswer: request.question ? questionAnswer : undefined,
      },
    };

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      response,
    ).catch((err) => {
      Logger.error(err, 'YearlySajuService');
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
  }): Promise<SajuRecord> {
    return this.prisma.sajuRecord.create({
      data: {
        user: {
          connect: {
            publicID: data.userUuid,
          },
        },
        type: SajuType.NEW_YEAR,
        version: YearlySajuService.version,
        data: data.data,
      },
    });
  }
}
