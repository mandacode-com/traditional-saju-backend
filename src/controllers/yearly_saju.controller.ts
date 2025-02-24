import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
} from 'src/schemas/yearly_saju.schema';
import { YearlySajuService } from 'src/services/yearly_saju.service';

@Controller('yearly')
export class YearlySajuController {
  constructor(private readonly yearlySajuService: YearlySajuService) {}

  @Post()
  @Roles(['user', 'admin', 'guest'])
  @HttpCode(200)
  async getYearlySaju(@Body() form: YearlySajuRequest) {
    const parsed = await YearlySajuRequestSchema.parseAsync({
      ...form,
      birthDateTime: new Date(form.birthDateTime),
    });
    const response = await this.yearlySajuService.getYearlySaju(parsed);

    return response;
  }
}
