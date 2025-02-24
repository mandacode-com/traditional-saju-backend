import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import {
  DailySajuRequest,
  DailySajuRequestSchema,
} from 'src/schemas/daily_saju.schema';
import { DailySajuService } from 'src/services/daily_saju.service';

@Controller('daily')
export class DailySajuController {
  constructor(private readonly dailySajuService: DailySajuService) {}

  @Post()
  @Roles(['user', 'admin', 'guest'])
  @HttpCode(200)
  async getDailySaju(@Body() body: DailySajuRequest) {
    const parsed = await DailySajuRequestSchema.parseAsync({
      ...body,
      birthDateTime: new Date(body.birthDateTime),
    });
    const response = await this.dailySajuService.getDailySaju(parsed);

    return response;
  }
}
