import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import {
  YearlySajuOpenAIResponseSchema,
  YearlySajuRequest,
  YearlySajuResponse,
  YearlySajuResponseSchema,
} from 'src/schemas/yearly_saju.schema';
import { PrismaService } from './prisma.service';
import { YearlyFortune } from '@prisma/client';

@Injectable()
export class YearlySajuService {
  static version = 1;

  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async getExistingYearlySaju(data: {
    userUuid: string;
  }): Promise<
    (Omit<YearlyFortune, 'fortune'> & { fortune: YearlySajuResponse }) | null
  > {
    const existingData = await this.prisma.yearlyFortune.findFirst({
      where: {
        user: {
          uuid: data.userUuid,
        },
        version: YearlySajuService.version,
        createdAt: {
          gte: new Date(new Date().getFullYear(), 0, 0),
        },
      },
    });

    if (!existingData) {
      return null;
    } else {
      const parsedFortune = await YearlySajuResponseSchema.parseAsync(
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

  async getYearlySaju(data: {
    request: YearlySajuRequest;
  }): Promise<YearlySajuResponse> {
    const respone = await this.openai.getYearlySaju(data.request);

    const parsed = await YearlySajuOpenAIResponseSchema.parseAsync(
      respone,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    const result: YearlySajuResponse = {
      name: 'John Doe',
      birthDateTime: data.request.birthDateTime,
      gender: data.request.gender,
      ...parsed,
    };

    const parsedResult = await YearlySajuResponseSchema.parseAsync(
      result,
    ).catch((_err) => {
      throw new InternalServerErrorException('Failed to parse response');
    });

    return parsedResult;
  }

  async saveYearlySaju(data: {
    data: YearlySajuResponse;
    userUuid: string;
  }): Promise<YearlyFortune> {
    const parsed = await YearlySajuResponseSchema.parseAsync(data.data).catch(
      (_err) => {
        throw new InternalServerErrorException('Failed to parse response');
      },
    );
    return this.prisma.yearlyFortune.create({
      data: {
        user: {
          connect: {
            uuid: data.userUuid,
          },
        },
        version: YearlySajuService.version,
        fortune: parsed,
        createdAt: new Date(),
      },
    });
  }
}
