import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/config.schema';

@Injectable()
export class TokenService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;

  constructor(
    private readonly jwt: JwtService,
    private readonly redis: Redis,
    private readonly config: ConfigService<Config, true>,
  ) {
    const tokenConfig = this.config.get<Config['token']>('token');
    this.accessTokenSecret = tokenConfig.accessTokenSecret;
    this.refreshTokenSecret = tokenConfig.refreshTokenSecret;
    this.accessTokenExpiresIn = tokenConfig.accessTokenExpiresIn;
    this.refreshTokenExpiresIn = tokenConfig.refreshTokenExpiresIn;
  }

  async issueToken(userID: string) {
    const accessTokenPayload: AccessTokenPayload = { userID };
    const refreshTokenPayload: RefreshTokenPayload = { userID };

    const accessToken = await this.jwt.signAsync(accessTokenPayload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = await this.jwt.signAsync(refreshTokenPayload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });

    await this.redis.set(
      `refreshToken:${userID}`,
      refreshToken,
      'EX',
      this.refreshTokenExpiresIn,
    );

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
      secret: this.accessTokenSecret,
    });
    return payload;
  }

  async verifyRefreshToken(token: string) {
    const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
      secret: this.refreshTokenSecret,
    });

    const storedToken = await this.redis.get(`refreshToken:${payload.userID}`);
    if (storedToken !== token) {
      throw new Error('Invalid refresh token');
    }

    return payload;
  }

  async revokeRefreshToken(userID: string) {
    await this.redis.del(`refreshToken:${userID}`);
  }
}
