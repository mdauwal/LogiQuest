import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Security = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    };
  },
);
