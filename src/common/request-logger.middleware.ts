import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Logs the request and reads a fake user from the `x-user-role` header.

// A real app would get the user from a token instead.
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, _response: Response, next: NextFunction) {
    this.logger.log(`${request.method} ${request.originalUrl}`);

    const role = request.header('x-user-role');
    
    if (role) {
      request.user = { id: request.header('x-user-id') ?? 'demo', role };
    }

    next();
  }
}
