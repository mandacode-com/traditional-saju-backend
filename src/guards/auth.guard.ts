import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/role.decorator';
import { UserRequest } from 'src/interfaces/user_request.interface';
import { Config } from 'src/schemas/config.schema';
import { Role, RoleEnum } from 'src/schemas/role.schema';
import { TokenPayload, tokenPayloadSchema } from 'src/schemas/token.schema';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Config, true>,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
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

    const headerKey = this.config.get<Config['auth']>('auth').gatewayJwtHeader;
    const token = request.headers[headerKey]?.toString();
    if (!token) {
      Logger.error(
        `AuthGuard: No token found in header ${headerKey}`,
        'AuthGuard',
      );
      throw new UnauthorizedException('Invalid token');
    }

    const secret = this.config.get<Config['auth']>('auth').gatewayJwtSecret;

    const verifiedToken = await this.jwtService
      .verifyAsync<TokenPayload>(token, {
        secret,
      })
      .catch(() => {
        Logger.error(`AuthGuard: Invalid token`, 'AuthGuard');
        throw new UnauthorizedException('Invalid token');
      });

    const parsedTokenPayload = await tokenPayloadSchema.safeParseAsync({
      uuid: verifiedToken.uuid,
      role: verifiedToken.role.toLowerCase(),
    });

    if (!parsedTokenPayload.success) {
      Logger.error(
        `AuthGuard: Invalid token payload ${JSON.stringify(
          parsedTokenPayload.error,
        )}`,
        'AuthGuard',
      );
      throw new UnauthorizedException('Invalid token');
    }
    // Validate the Role
    const isValidRole = requiredRoles.some(
      (requiredRole) => requiredRole === parsedTokenPayload.data.role,
    );
    if (!isValidRole) {
      return false;
    }

    // Check if the user exists in the database
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: parsedTokenPayload.data.uuid,
      },
    });
    if (!user) {
      await this.prisma.user.create({
        data: {
          uuid: parsedTokenPayload.data.uuid,
        },
      });
    }

    // Set the user object to the request object
    request.user = {
      uuid: parsedTokenPayload.data.uuid,
      role: parsedTokenPayload.data.role,
    };
    return true;
  }
}
