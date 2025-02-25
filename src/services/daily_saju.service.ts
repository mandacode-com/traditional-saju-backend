import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  DailySajuOpenAIResponseSchema,
  DailySajuRequest,
  DailySajuResponse,
  DailySajuResponseSchema,
} from 'src/schemas/daily_saju.schema';
import { PrismaService } from './prisma.service';
import { DailyFortune } from '@prisma/client';

@Injectable()
export class DailySajuService {
  static version = 1;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingDailySaju(data: {
    userUuid: string;
  }): Promise<
    (Omit<DailyFortune, 'fortune'> & { fortune: DailySajuResponse }) | null
  > {
    const existingData = await this.prisma.dailyFortune.findFirst({
      where: {
        user: {
          uuid: data.userUuid,
        },
        version: DailySajuService.version,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    if (!existingData) {
      return null;
    } else {
      const parsedFortune = await DailySajuResponseSchema.parseAsync(
        existingData.fortune,
      ).catch((_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      });
      return {
        ...existingData,
        fortune: parsedFortune,
      };
    }
  }

  async getDailySaju(data: {
    request: DailySajuRequest;
  }): Promise<DailySajuResponse> {
    const respone = await this.openai
      .getDailySaju(data.request)
      .then((res) => res.choices[0].message.parsed);

    const parsed = await DailySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: DailySajuResponse = {
      name: 'John Doe',
      birthDateTime: data.request.birthDateTime,
      gender: data.request.gender,
      ...parsed,
    };

    const parsedResult = await DailySajuResponseSchema.parseAsync(result).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );

    return parsedResult;
  }

  async saveDailySaju(data: {
    data: DailySajuResponse;
    userUuid: string;
  }): Promise<DailyFortune> {
    const parsed = await DailySajuResponseSchema.parseAsync(data.data).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );
    return this.prisma.dailyFortune.create({
      data: {
        user: {
          connect: {
            uuid: data.userUuid,
          },
        },
        version: DailySajuService.version,
        fortune: parsed,
        createdAt: new Date(),
      },
    });
  }
}
