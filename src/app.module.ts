import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/validate';
import { YearlySajuModule } from './modules/saju/yearly_saju.module';
import { AppController } from './app.controller';
import { DailySajuModule } from './modules/saju/daily_saju.module';
import { DevController } from './dev.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from './schemas/config.schema';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validate,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Config, true>) => ({
        secret: config.get<Config['auth']>('auth').gatewayJwtSecret,
        global: true,
      }),
      global: true,
    }),
    YearlySajuModule,
    DailySajuModule,
    AuthModule,
  ],
  controllers: [AppController, DevController],
})
export class AppModule {}
