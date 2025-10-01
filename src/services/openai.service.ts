import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ChatModel } from 'openai/resources';
import { z } from 'zod';
import { Config } from '../config/config.schema';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface StructuredCompletionOptions<T> {
  messages: OpenAIMessage[];
  schema: z.ZodSchema<T>;
  schemaName?: string;
  model?: ChatModel;
}

interface SimpleCompletionOptions {
  messages: OpenAIMessage[];
  model?: ChatModel;
}

@Injectable()
export class OpenAIService {
  private chatModel: ChatModel = 'gpt-4o-mini';
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

  async createStructuredCompletion<T>(
    options: StructuredCompletionOptions<T>,
  ): Promise<T> {
    const {
      messages,
      schema,
      schemaName = 'Response',
      model = this.chatModel,
    } = options;

    const response = await this.openAI.chat.completions.parse({
      model,
      messages,
      response_format: zodResponseFormat(schema, schemaName),
    });

    const parsed = response.choices[0].message.parsed;
    if (!parsed) {
      throw new InternalServerErrorException(
        'Failed to parse structured response',
      );
    }

    return schema.parse(parsed);
  }

  async createCompletion(options: SimpleCompletionOptions): Promise<string> {
    const { messages, model = this.chatModel } = options;

    const response = await this.openAI.chat.completions.create({
      model,
      messages,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new InternalServerErrorException('Failed to get response content');
    }

    return content;
  }

  async createMultipleCompletions(
    requests: SimpleCompletionOptions[],
  ): Promise<string[]> {
    const responses = await Promise.all(
      requests.map((options) => this.createCompletion(options)),
    );

    return responses;
  }
}
