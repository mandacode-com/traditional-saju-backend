import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { User } from 'src/decorators/user.decorator';
import { RoleEnum } from 'src/schemas/role.schema';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
  YearlySajuResponse,
} from 'src/schemas/yearly_saju.schema';
import { YearlySajuService } from 'src/services/yearly_saju.service';

@Controller('yearly')
export class YearlySajuController {
  constructor(private readonly yearlySajuService: YearlySajuService) {}

  @Post()
  @Roles([RoleEnum.USER, RoleEnum.ADMIN])
  @HttpCode(200)
  async getYearlySaju(
    @Body() form: YearlySajuRequest,
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
    const parsed = await YearlySajuRequestSchema.parseAsync({
      ...form,
      birthDateTime: new Date(form.birthDateTime),
    });
    const response = await this.yearlySajuService.getYearlySaju({
      request: parsed,
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
