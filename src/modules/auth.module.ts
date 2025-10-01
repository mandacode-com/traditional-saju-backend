import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PrismaModule } from './prisma.module';
import { TokenModule } from './token.module';
import { UserModule } from './user.module';

@Module({
  imports: [PrismaModule, TokenModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
