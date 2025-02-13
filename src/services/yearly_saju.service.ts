import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
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

    const parsed = YearlySajuResponseSchema.parseAsync(respone).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    return parsed;
  }
}
