import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '..';

@Catch()
export class GenericExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenericExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp(),
      response = context.getResponse<Response>(),
      request = context.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error happened with your request.';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
    }

    if (
      statusCode === HttpStatus.INTERNAL_SERVER_ERROR ||
      !(exception instanceof HttpException)
    ) {
      this.logger.error(
        `Error on ${request.method} ${request.url}`,
        JSON.stringify(message),
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const errorResponseDto = ApiResponseDto.createError(statusCode, message);
    response.status(statusCode).json(errorResponseDto);
  }
}
