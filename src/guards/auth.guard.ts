import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/role.decorator';
import { UserRequest } from 'src/interfaces/user_request.interface';
import { Role } from 'src/schemas/role.schema';
import { TokenPayload, tokenPayloadSchema } from 'src/schemas/token.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const roles = this.reflector.get<Role[]>(Roles, context.getHandler());
    if (!roles) {
      return false;
    }
    if (roles.includes('guest')) {
      return true;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const payload = await this.jwtService.verifyAsync<TokenPayload>(
      authHeader.split(' ')[1],
    );

    const parsedPayload = await tokenPayloadSchema.safeParseAsync(payload);

    if (!parsedPayload.success) {
      return false;
    }
    if (!roles.includes(parsedPayload.data.role)) {
      return false;
    }

    request.user = parsedPayload.data;
    return true;
  }
}
