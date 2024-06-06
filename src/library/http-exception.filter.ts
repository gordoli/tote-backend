import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/core';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private _logger = new LoggerService(HttpExceptionFilter.name);
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const {
      code,
      message,
      data = null,
      module,
    }: ResponseException = exception.getResponse() as ResponseException;
    this._logger.error('Unhandled exception', exception.getResponse());

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      code: code || 'unknown',
      message,
      module,
      data,
    });
  }
  public static throwError(
    exception: ResponseException = {},
    status = HttpStatus.BAD_REQUEST,
  ) {
    throw new HttpException(exception, status);
  }
}

export type ResponseException = {
  status?: HttpStatus;
  error?: string;
  code?: string;
  url?: string;
  message?: string;
  module?: string;
  data?: object;
};
