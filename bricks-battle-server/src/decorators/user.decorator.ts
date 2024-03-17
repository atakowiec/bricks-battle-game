import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator((data: string, req: ExecutionContext) => {
  const request = req.switchToHttp().getRequest();
  return data ? request.user[data] : request.user;
})