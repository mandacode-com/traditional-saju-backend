import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/validate';
import { YearlySajuModule } from './modules/yearly_saju.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    YearlySajuModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
