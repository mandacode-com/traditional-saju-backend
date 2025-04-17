import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
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

@Controller('daily')
export class DailySajuController {
  constructor(private readonly dailySajuService: DailySajuService) {}

  @Post()
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
}
