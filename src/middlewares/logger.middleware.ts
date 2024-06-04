import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { COMMON_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core/logger';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private _logger = new LoggerService(LoggerMiddleware.name);
  public use(request: Request, response: Response, next: NextFunction) {
    const startTime = process.hrtime();
    const ipAddress = request.headers['x-forwarded-for'];
    this._logger.log(
      `Request start - ${ipAddress} - [${request.method}] - ${
        request.url
      } - api version ${
        request.headers[COMMON_CONSTANT.HEADER.API_VERSION] || 'default'
      }`,
    );
    if (request.body) {
      this._logger.log(`REQUEST BODY - `, request.body);
    }
    response.once('close', () => {
      if (response.statusCode >= 200 && response.statusCode <= 299) {
        this._logger.log(
          `Request finished - [${request.method}] - ${request.url}`,
        );
      } else {
        this._logger.log(`Request failed ${request.url}`);
      }
      // Calculate elapsed time
      const elapsedSeconds = process.hrtime(startTime)[0];
      const elapsedMilliseconds = process.hrtime(startTime)[1] / 1e6;
      const elapsedTime = elapsedSeconds + elapsedMilliseconds / 1000;

      // Log the elapsed time using the logger
      this._logger.debug(
        `Execution time: ${elapsedTime.toFixed(3)} seconds - [${
          request.method
        }] - ${request.url}`,
      );
    });
    next();
  }
}
