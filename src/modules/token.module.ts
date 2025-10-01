import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '../services/token.service';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config/config.schema';

@Module({
  imports: [JwtModule],
  providers: [
    TokenService,
    {
      provide: Redis,
      useFactory: (config: ConfigService<Config, true>) => {
        const redisConfig = config.get<Config['redis']>('redis');
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
