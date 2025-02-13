import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  YearlySajuRequest,
  YearlySajuRequestSchema,
} from 'src/schemas/yearly_saju.schema';
import { YearlySajuService } from 'src/services/yearly_saju.service';

@Controller('yearly')
export class YearlySajuController {
  constructor(private readonly yearlySajuService: YearlySajuService) {}

  @Post()
  @HttpCode(200)
  async getYearlySaju(@Body() form: YearlySajuRequest) {
    const parsed = YearlySajuRequestSchema.parse({
      ...form,
      birthDateTime: new Date(form.birthDateTime),
    });
    const response = await this.yearlySajuService.getYearlySaju(parsed);

    return response;
  }
}
