import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions';
import { Config } from 'src/schemas/config.schema';
import {
  YearlySajuRequest,
  YearlySajuResponse,
  YearlySajuResponseSchema,
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
  ): Promise<ParsedChatCompletion<YearlySajuResponse>> {
    return this.openAI.beta.chat.completions.parse({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Create yearly four pillars pf destiny',
        },
        {
          role: 'user',
          content: JSON.stringify(form),
        },
      ],
      response_format: zodResponseFormat(
        YearlySajuResponseSchema,
        'YearlySajuResponse',
      ),
    });
  }
}
