import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/decorators/role.decorator';
import { UserRequest } from 'src/interfaces/user_request.interface';
import { Role, RoleEnum } from 'src/schemas/role.schema';
import { TokenPayload, tokenPayloadSchema } from 'src/schemas/token.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
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
}
