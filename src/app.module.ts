import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validate';
import { AppController } from './app.controller';
import { DevController } from './dev.controller';
import { AuthModule } from './modules/auth.module';
import { AuthApiModule } from './modules/auth-api.module';
import { SajuModule } from './modules/saju.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    AuthModule, // Global JWT Guard
    AuthApiModule, // Auth API endpoints
    SajuModule,
  ],
  controllers: [AppController, DevController],
})
export class AppModule {}
