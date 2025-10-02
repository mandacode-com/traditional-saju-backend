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

        // Sentinel mode
        if (redisConfig.mode === 'sentinel') {
          return new Redis({
            sentinels: redisConfig.sentinels,
            name: redisConfig.name,
            password: redisConfig.password,
            sentinelPassword: redisConfig.sentinelPassword,
            db: redisConfig.db,
          });
        }

        // Standalone mode (default)
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          db: redisConfig.db,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
