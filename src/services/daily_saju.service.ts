import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  DailySajuOpenAIResponseSchema,
  DailySajuRequest,
  DailySajuResponse,
  DailySajuResponseSchema,
} from 'src/schemas/daily_saju.schema';

@Injectable()
export class DailySajuService {
  constructor(private readonly openai: OpenAIService) {}

  async getDailySaju(request: DailySajuRequest): Promise<DailySajuResponse> {
    const respone = await this.openai
      .getDailySaju(request)
      .then((res) => res.choices[0].message.parsed);

    const parsed = await DailySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: DailySajuResponse = {
      name: 'John Doe',
      birthDateTime: request.birthDateTime,
      gender: request.gender,
      ...parsed,
    };

    const parsedResult = await DailySajuResponseSchema.parseAsync(result).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    return parsedResult;
  }
}
