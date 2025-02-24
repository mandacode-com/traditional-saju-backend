import { Controller, Get, HttpCode } from '@nestjs/common';
import { Roles } from './decorators/role.decorator';

@Controller('/')
export class AppController {
  constructor() {}

  @Get('/health')
  @Roles(['guest'])
  @HttpCode(200)
  getHello(): string {
    return 'OK';
  }
}
