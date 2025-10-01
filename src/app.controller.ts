import { Controller, Get, HttpCode } from '@nestjs/common';
import { Public } from './decorators/public.decorator';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/health')
  @HttpCode(200)
  @Public()
  health(): string {
    return 'OK';
  }
}
