import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from 'src/exceptions/interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let errorResponse: ErrorResponse = {
      statusCode: status,
      message: 'Internal server error',
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle case where getResponse() returns a string or object
      if (typeof exceptionResponse === 'string') {
        errorResponse.message = exceptionResponse;
      } else {
        errorResponse = {
          ...errorResponse,
          ...(exceptionResponse as object),
          statusCode: status,
        };
      }
    }

    // Log the error details
    this.logger.error(
      `${status} - ${exception instanceof Error ? exception.message : exception}`,
    );

    response.status(status).json(errorResponse);
  }
}
