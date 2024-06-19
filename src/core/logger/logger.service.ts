import { Logger } from '@nestjs/common';
import * as httpContext from 'express-http-context';
import { ILogger } from '../types';

type LOG_METHOD = 'log' | 'error' | 'warn' | 'debug';
type LogData = number | string | Record<string, any>;
export class LoggerService implements ILogger {
  private _logger: Logger;

  constructor(context: string) {
    this._logger = new Logger(context);
  }
  log(message: string, data?: LogData) {
    this._writeLog('log', message, data);
  }

  error(message: string, data?: LogData) {
    this._writeLog('error', message, data);
  }

  warn(message: string, data?: LogData) {
    this._writeLog('warn', message, data);
  }

  debug(message: string, data?: LogData) {
    this._writeLog('debug', message, data);
  }

  private _writeLog(method: LOG_METHOD, message: string, data?: LogData) {
    const payload = this._preparePayload(message, data);
    this._logger[method](payload);
  }

  private _preparePayload(message: any, data?: LogData) {
    return `${message} ${data ? JSON.stringify(data) : ''}`;
  }
}
