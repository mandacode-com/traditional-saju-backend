import { Injectable } from '@nestjs/common';
import {
  UserIdentityResponseDto,
  UserIdentityResponseSchema,
} from './types/idp.type';

@Injectable()
export class IdpService {
  private idpBaseUrl: string;

  constructor(idpBaseUrl: string) {
    this.idpBaseUrl = idpBaseUrl;
  }

  async login(accessToken: string) {
    const response = await fetch(`${this.idpBaseUrl}/userinfo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info from IDP');
    }

    const data = (await response.json()) as UserIdentityResponseDto;
    const parsedData = UserIdentityResponseSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error('Invalid user info format from IDP');
    }

    return parsedData.data;
  }
}
