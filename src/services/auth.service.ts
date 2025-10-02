import { Injectable } from '@nestjs/common';
import { IdpService } from './idp.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly idp: IdpService,
    private readonly token: TokenService,
    private readonly userService: UserService,
  ) {}

  // Login with OAuth2 access token from provider
  async login(accessToken: string, provider: string) {
    const idpUserInfo = await this.idp.login(accessToken, provider);

    // Find or create user in our database
    const user = await this.userService.findOrCreate({
      publicID: idpUserInfo.userId,
      nickname: idpUserInfo.nickname,
      email: idpUserInfo.email,
    });

    // Issue tokens with user info from our database
    const tokens = await this.token.issueToken(user.publicID, user.nickname);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
