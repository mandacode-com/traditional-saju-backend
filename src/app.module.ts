import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/validate';
import { YearlySajuModule } from './modules/yearly_saju.module';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from './schemas/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => ({
        secret: configService.get<Config['jwt']>('jwt').secret,
      }),
      global: true,
    }),
    YearlySajuModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
