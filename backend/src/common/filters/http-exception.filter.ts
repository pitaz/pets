import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      // Handle Prisma errors
      if (
        exception.message.includes('P1001') ||
        exception.message.includes("Can't reach database")
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Database connection failed';
        error = 'Service Unavailable';
      } else if (exception.message.includes('P2002')) {
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        error = 'Conflict';
      } else if (exception.message.includes('P2025')) {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'Not Found';
      } else {
        message = exception.message || 'Internal server error';
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }
}
