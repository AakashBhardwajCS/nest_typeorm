import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

// TypeORM throws EntityNotFoundError from the `...OrFail` methods.
// Without this filter the client would get a 500.

@Catch(EntityNotFoundError)
export class NotFoundFilter implements ExceptionFilter {
  catch(_exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Resource not found.',
    });
  }
}
