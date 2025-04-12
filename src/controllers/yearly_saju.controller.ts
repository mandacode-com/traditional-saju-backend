import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod_validation.pipe';
import { RoleEnum } from 'src/schemas/role.schema';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
  YearlySajuResponse,
} from 'src/schemas/saju/yearly_saju.schema';
import { YearlySajuService } from 'src/services/saju/yearly_saju.service';

@Controller('yearly')
export class YearlySajuController {
  constructor(private readonly yearlySajuService: YearlySajuService) {}

  @Post()
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
        return existing.fortune;
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
