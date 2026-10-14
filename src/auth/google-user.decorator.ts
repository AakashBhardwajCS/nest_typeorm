import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from './entities/user.entity.js';

// The user GoogleStrategy.validate() returned (passport stores it on request.user)
export const GoogleUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User =>
    context.switchToHttp().getRequest().user,
);
