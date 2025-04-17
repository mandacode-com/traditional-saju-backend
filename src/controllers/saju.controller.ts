import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';
import {
  DailySajuRequest,
  DailySajuRequestSchema,
  DailySajuResponse,
} from 'src/schemas/saju/daily_saju.schema';
import { RoleEnum } from 'src/schemas/role.schema';
import { DailySajuService } from 'src/services/saju/daily_saju.service';
import { ZodValidationPipe } from 'src/pipes/zod_validation.pipe';
import { YearlySajuService } from 'src/services/saju/yearly_saju.service';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
  YearlySajuResponse,
} from 'src/schemas/saju/yearly_saju.schema';

@Controller('read')
export class SajuController {
  constructor(
    private readonly dailySajuService: DailySajuService,
    private readonly yearlySajuService: YearlySajuService,
  ) {}

  @Post('daily')
  @Roles([RoleEnum.USER, RoleEnum.ADMIN])
  @HttpCode(200)
  async getDailySaju(
    @Body(new ZodValidationPipe(DailySajuRequestSchema)) body: DailySajuRequest,
    @User('uuid') uuid?: string,
  ): Promise<DailySajuResponse> {
    // Check if the user has already requested the daily saju
    if (uuid) {
      const existing = await this.dailySajuService.getExistingDailySaju({
        userUuid: uuid,
      });
      if (existing) {
        return existing;
      }
    }
    const response = await this.dailySajuService.getDailySaju({
      request: body,
    });

    // Save the response if the user is logged in
    if (uuid) {
      await this.dailySajuService.saveDailySaju({
        data: response,
        userUuid: uuid,
      });
    }
    return response;
  }

  @Post('yearly')
  @Roles([RoleEnum.USER, RoleEnum.ADMIN])
  @HttpCode(200)
  async getYearlySaju(
    @Body(new ZodValidationPipe(YearlySajuRequestSchema))
    body: YearlySajuRequest,
    @User('uuid') uuid?: string,
  ): Promise<YearlySajuResponse> {
    // Check if the user has already requested the yearly saju
    if (uuid) {
      const existing = await this.yearlySajuService.getExistingYearlySaju({
        userUuid: uuid,
      });
      if (existing) {
        return existing;
      }
    }

    const response = await this.yearlySajuService.getYearlySaju({
      request: body,
    });

    // Save the response if the user is logged in
    if (uuid) {
      await this.yearlySajuService.saveYearlySaju({
        data: response,
        userUuid: uuid,
      });
    }

    return response;
  }
}
