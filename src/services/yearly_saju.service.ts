import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
  YearlySajuResponse,
  YearlySajuResponseSchema,
} from 'src/schemas/yearly_saju.schema';

@Injectable()
export class YearlySajuService {
  constructor(private readonly openai: OpenAIService) {}

  async getYearlySaju(form: YearlySajuRequest): Promise<YearlySajuResponse> {
    const respone = await this.openai
      .getYearlySaju(form)
      .then((res) => res.choices[0].message.parsed);

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: YearlySajuResponse = {
      name: 'John Doe',
      birthDateTime: form.birthDateTime,
      gender: form.gender,
      ...parsed,
    };

    const parsedResult = await YearlySajuResponseSchema.parseAsync(
      result,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsedResult;
  }
}
