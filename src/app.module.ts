import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/validate';
import { AppController } from './app.controller';
import { DevController } from './dev.controller';
import { JwtModule } from '@nestjs/jwt';
import { Config } from './schemas/config.schema';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { SajuModule } from './modules/saju.module';

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
    UserModule,
    AuthModule,
    SajuModule,
  ],
  controllers: [AppController, DevController],
})
export class AppModule {}
