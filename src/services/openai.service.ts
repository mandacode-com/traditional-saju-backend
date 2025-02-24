import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions';
import { Config } from 'src/schemas/config.schema';
import {
  DailySajuOpenAIResponseSchema,
  DailySajuRequest,
  DailySajuResponse,
} from 'src/schemas/daily_saju.schema';
import {
  YearlySajuOpenAIResponse,
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
} from 'src/schemas/yearly_saju.schema';

@Injectable()
export class OpenAIService {
  private openAI: OpenAI;
  private openAIConfig: Config['openai'];

  constructor(private readonly config: ConfigService<Config, true>) {
    this.openAIConfig = this.config.get<Config['openai']>('openai');
  }

  onModuleInit() {
    this.openAI = new OpenAI({
      apiKey: this.openAIConfig.api_key,
    });
  }

  async getYearlySaju(
    form: YearlySajuRequest,
  ): Promise<ParsedChatCompletion<YearlySajuOpenAIResponse>> {
    return this.openAI.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '사주팔자를 알려줘. 천간, 지지, 오행은 각각 4개씩 년주, 월주, 일주, 시주 순으로 있어야 해.',
        },
        {
          role: 'user',
          content: JSON.stringify(form),
        },
      ],
      response_format: zodResponseFormat(
        YearlySajuOpenAIResponseSchema,
        'YearlySajuResponse',
      ),
    });
  }

  async getDailySaju(
    form: DailySajuRequest,
  ): Promise<ParsedChatCompletion<DailySajuResponse>> {
    return this.openAI.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '사주팔자를 알려줘. 성별, 생년월일, 연애상태, 직업상태를 입력해야 해.',
        },
        {
          role: 'user',
          content: JSON.stringify(form),
        },
      ],
      response_format: zodResponseFormat(
        DailySajuOpenAIResponseSchema,
        'DailySajuResponse',
      ),
    });
  }
}
