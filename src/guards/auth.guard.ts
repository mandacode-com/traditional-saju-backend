import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRequest } from 'src/interfaces/user_request.interface';
import { TokenPayload, tokenPayloadSchema } from 'src/schemas/token.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const payload = this.jwtService.verify<TokenPayload>(
      authHeader.split(' ')[1],
    );

    const parsedPayload = await tokenPayloadSchema.safeParseAsync(payload);

    if (!parsedPayload.success) {
      return false;
    }

    request.user = parsedPayload.data;
    return true;
  }
}
