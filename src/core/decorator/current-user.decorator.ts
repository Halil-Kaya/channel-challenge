import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../interface';

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
