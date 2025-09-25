import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users/users.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // user is attached by Passport JWT strategy
  },
);
