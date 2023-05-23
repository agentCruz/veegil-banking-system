import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../user/user.entity';

export const GetUser = createParamDecorator(
  (data, req: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(req);
    return ctx.getContext().req.user;
  },
);
