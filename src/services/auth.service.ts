import { Injectable } from '@nestjs/common';
import { IdpService } from './idp.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly idp: IdpService,
    private readonly token: TokenService,
  ) {}

  // Login with OAuth2 access token from provider
  async login(accessToken: string, provider: string) {
    const idpUserInfo = await this.idp.login(accessToken, provider);

    // Issue tokens with user info from IDP
    const tokens = await this.token.issueToken(
      idpUserInfo.userId,
      idpUserInfo.nickname,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
