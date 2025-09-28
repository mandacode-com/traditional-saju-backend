import { Injectable } from '@nestjs/common';
import { IdpService } from './idp.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly idp: IdpService,
    private readonly token: TokenService,
  ) {}

  async login(accessToken: string) {
    const userInfo = await this.idp.login(accessToken);
    const tokens = await this.token.issueToken(userInfo.userId);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
