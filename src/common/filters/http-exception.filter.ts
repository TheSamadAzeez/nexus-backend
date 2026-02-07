import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// an exception filter is a class that implements the ExceptionFilter interface
// it is used to handle exceptions globally
// the catch method is called when an exception is thrown
// the ExceptionFilter interface has a catch method that takes an exception and an ArgumentsHost as parameters
// the ArgumentsHost is used to get the request and response objects
// the catch method is called with the exception and the ArgumentsHost

/**
 * Exception filter for handling HTTP exceptions
 * @param exception The exception to handle
 * @param host The arguments host
 * @returns it outputs a JSON response with the following structure:
 * ```json
 * {
 *   "statusCode": 500,
 *   "timestamp": "2022-01-01T00:00:00.000Z",
 *   "path": "/api/v1/users",
 *   "method": "GET",
 *   "message": "Internal server error"
 * }
 * ```
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    });
  }
}
