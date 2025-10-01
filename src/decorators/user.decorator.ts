import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserPayload {
  userId: string;
  userName: string;
}

export const User = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: UserPayload }>();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
