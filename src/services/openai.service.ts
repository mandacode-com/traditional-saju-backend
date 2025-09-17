import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatModel } from 'openai/resources';
import { Config } from 'src/schemas/config.schema';
import {
  DailySajuOpenAIResponse,
  DailySajuOpenAIResponseSchema,
  DailySajuRequest,
} from 'src/schemas/saju/daily_saju.schema';
import {
  YearlySajuOpenAIResponse,
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
} from 'src/schemas/saju/yearly_saju.schema';
import { generateScore } from 'src/utils/generateScore';

@Injectable()
export class OpenAIService {
  private chatModel: ChatModel = 'gpt-4o-mini';

  private openAI: OpenAI;
  private openAIConfig: Config['openai'];
  private yearlyConfig: Config['openai']['system_message']['yearly'];
  private dailyConfig: Config['openai']['system_message']['daily'];

  constructor(private readonly config: ConfigService<Config, true>) {
    this.openAIConfig = this.config.get<Config['openai']>('openai');
    this.yearlyConfig = this.openAIConfig.system_message.yearly;
    this.dailyConfig = this.openAIConfig.system_message.daily;
  }

  onModuleInit() {
    this.openAI = new OpenAI({
      apiKey: this.openAIConfig.api_key,
    });
  }

  async getYearlySaju(
    form: YearlySajuRequest,
  ): Promise<YearlySajuOpenAIResponse> {
    const chart = await this.openAI.chat.completions
      .parse({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.chart,
          },
          {
            role: 'user',
            content: JSON.stringify(form),
          },
        ],
        response_format: zodResponseFormat(
          YearlySajuOpenAIResponseSchema.shape.chart,
          'YearlySajuResponse',
        ),
      })
      .then((res) => res.choices[0].message.parsed);

    if (!chart) {
      throw new InternalServerErrorException('Failed to get chart');
    }

    if (form.birthTimeDisabled) {
      chart.earthly.branches.hour = undefined;
      chart.earthly.fiveElements.hour = undefined;
      chart.heavenly.stems.hour = undefined;
      chart.heavenly.fiveElements.hour = undefined;
    }

    const userChartInfo = {
      user: {
        datingStatus: form.datingStatus,
        birthDateTime: form.birthDateTime,
        gender: form.gender,
        jobStatus: form.jobStatus,
      },
      chart,
    };

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
    ] = await Promise.all([
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.general,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.relationship,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.wealth,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.romantic,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.health,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.career,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.waysToImprove,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.caution,
          },
          {
            role: 'user',
            content: JSON.stringify(userChartInfo),
          },
        ],
      }),
      this.openAI.chat.completions.create({
        model: this.chatModel,
        messages: [
          {
            role: 'system',
            content: this.yearlyConfig.questionAnswer,
          },
          {
            role: 'user',
            content: JSON.stringify({
              ...userChartInfo,
              question: form.question,
            }),
          },
        ],
      }),
    ]);

    if (
      !general.choices[0].message.content ||
      !relationship.choices[0].message.content ||
      !wealth.choices[0].message.content ||
      !romantic.choices[0].message.content ||
      !health.choices[0].message.content ||
      !career.choices[0].message.content ||
      !waysToImprove.choices[0].message.content ||
      !caution.choices[0].message.content ||
      !questionAnswer.choices[0].message.content
    ) {
      throw new InternalServerErrorException('Failed to get description');
    }

    const response: YearlySajuOpenAIResponse = {
      chart,
      description: {
        general: general.choices[0].message.content,
        relationship: relationship.choices[0].message.content,
        wealth: wealth.choices[0].message.content,
        romantic: romantic.choices[0].message.content,
        health: health.choices[0].message.content,
        career: career.choices[0].message.content,
        waysToImprove: waysToImprove.choices[0].message.content,
        caution: caution.choices[0].message.content,
        questionAnswer: form.question
          ? questionAnswer.choices[0].message.content
          : undefined,
      },
    };

    const parsedResponse = YearlySajuOpenAIResponseSchema.parse(response);

    return parsedResponse;
  }

  async getDailySaju(form: DailySajuRequest): Promise<DailySajuOpenAIResponse> {
    const score = generateScore();
    const response = await this.openAI.chat.completions.parse({
      model: this.chatModel,
      messages: [
        {
          role: 'system',
          content: this.dailyConfig.all,
        },
        {
          role: 'user',
          content: JSON.stringify({
            ...form,
            score,
          }),
        },
      ],
      response_format: zodResponseFormat(
        DailySajuOpenAIResponseSchema.omit({ fortuneScore: true }),
        'DailySajuResponse',
      ),
    });

    if (!response.choices[0].message.parsed) {
      throw new InternalServerErrorException('Failed to get response');
    }

    const parsedResponse = DailySajuOpenAIResponseSchema.parse({
      ...response.choices[0].message.parsed,
      fortuneScore: score,
    });

    return {
      ...parsedResponse,
      questionAnswer: form.question ? parsedResponse.questionAnswer : undefined,
    };
  }
}
