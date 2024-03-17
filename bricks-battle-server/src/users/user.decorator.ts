import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';


export const RequestUser = createParamDecorator(function(data: string, ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    Inject(AuthGuard)
      // @ts-ignore
  }

  return data ? request.user[data] : request.user;
});