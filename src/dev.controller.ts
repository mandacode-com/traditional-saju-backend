import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { Public } from './decorators/public.decorator';
import type { Request } from 'express';

@Controller('/dev')
export class DevController {
  @Get('/gateway-feedback/headers')
  @HttpCode(200)
  @Public()
  getHeaderValues(@Req() req: Request) {
    console.log(req.rawHeaders);

    return {
      message: 'header list has been printed on the console',
    };
  }

  @Get('/gateway-feedback/user-id')
  @HttpCode(200)
  getUserId(@User('userId') userId: string) {
    console.log(userId);

    return {
      message: 'userId has been printed on the console',
      userId,
    };
  }

  @Get('/gateway-feedback/user-name')
  @HttpCode(200)
  getUserName(@User('userName') userName: string) {
    console.log(userName);

    return {
      message: 'userName has been printed on the console',
      userName,
    };
  }
}
