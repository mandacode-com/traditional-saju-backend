import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/role.decorator';
import { UserRequest } from 'src/interfaces/user_request.interface';
import { Config } from 'src/schemas/config.schema';
import { Role, RoleEnum } from 'src/schemas/role.schema';
import { TokenPayload, tokenPayloadSchema } from 'src/schemas/token.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Config, true>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const requiredRoles = this.reflector.get<Role[]>(
      Roles,
      context.getHandler(),
    );
    // If there are no required roles, then the route is public
    if (!requiredRoles) {
      return true;
    }
    // If required roles include GUEST, then the route is public
    if (requiredRoles.includes(RoleEnum.GUEST)) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const payload = await this.jwtService.verifyAsync<TokenPayload>(
      authHeader.split(' ')[1],
    );

    // Uncomment the following lines to enable fallback token
    //const fallbackToken = (request.headers['x-fallback-token'] ?? '')
    //  .toString()
    //  .split(' ')[1];

    const parsedPayload = await tokenPayloadSchema.safeParseAsync(payload);

    if (!parsedPayload.success) {
      return false;
    }
    if (!requiredRoles.includes(parsedPayload.data.role)) {
      return false;
    }

    // Set the user object to the request object
    request.user = parsedPayload.data;
    return true;
  }

  async validateFallbackToken(token: string) {
    const result = await fetch(
      this.config.get<Config['auth']>('auth').mandacode.verifyTokenEndpoint,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (result.status !== 200) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = (await result.json()) as TokenPayload;
    const parsedPayload = await tokenPayloadSchema.safeParseAsync(payload);

    if (!parsedPayload.success) {
      throw new UnauthorizedException('Invalid token');
    }

    return parsedPayload.data;
  }
}
