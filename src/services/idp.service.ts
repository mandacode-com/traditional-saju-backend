import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  UserIdentityResponseDto,
  UserIdentityResponseSchema,
} from './types/idp.type';
import { Config } from 'src/config/config.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IdpService implements OnModuleInit {
  private readonly logger = new Logger(IdpService.name);
  private authUrl: string;
  private userUrl: string;
  private clientID: string;
  private clientSecret: string;

  constructor(configService: ConfigService<Config, true>) {
    const idpConfig = configService.get<Config['idp']>('idp');
    if (!idpConfig) {
      throw new Error('IDP configuration is missing');
    }
    this.authUrl = idpConfig.authUrl;
    this.userUrl = idpConfig.userUrl;
    this.clientID = idpConfig.clientId;
    this.clientSecret = idpConfig.clientSecret;
  }

  async onModuleInit() {
    await this.checkHealth();
  }

  private async checkHealth(): Promise<void> {
    try {
      const authHealthResponse = await fetch(`${this.authUrl}/health`, {
        method: 'GET',
      });

      if (!authHealthResponse.ok) {
        throw new Error(
          `Auth service health check failed with status: ${authHealthResponse.status}`,
        );
      }

      const userHealthResponse = await fetch(`${this.userUrl}/health`, {
        method: 'GET',
      });

      if (!userHealthResponse.ok) {
        throw new Error(
          `User service health check failed with status: ${userHealthResponse.status}`,
        );
      }

      this.logger.log('IDP service health check passed');
    } catch (error) {
      this.logger.error('IDP service health check failed', error);
      throw new Error(
        `Failed to connect to IDP service: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async login(accessToken: string, provider: string) {
    const response = await fetch(
      `${this.authUrl}/auth/token?client_id=${this.clientID}&client_secret=${this.clientSecret}&provider=${provider}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

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

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(
      `${this.userUrl}/user/${userId}?client_id=${this.clientID}&client_secret=${this.clientSecret}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete user from IDP');
    }
  }
}
