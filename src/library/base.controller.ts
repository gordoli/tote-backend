import { HttpStatus, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CookieOptions, Request, Response } from 'express';
import { MESSAGE_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core';
import { ILogger } from 'src/core/types';

export abstract class BaseController {
  protected _logger: ILogger;
  @Inject(REQUEST) protected _request: Request;

  constructor(className = BaseController.name) {
    this._logger = new LoggerService(className);
  }

  public static getBaseUrl(request: Request) {
    return `${request.protocol}://${request.get('Host')}${request.originalUrl}`;
  }

  public responseCustom<T>(res: Response, data?: T, options?: ResponseOption) {
    const {
      message,
      total,
      code,
      status = HttpStatus.OK,
      extraData,
      page,
      perPage,
    } = new ResponseOption(options);

    res.status(status).send({
      status,
      message,
      data,
      total,
      code,
      extraData,
      page,
      perPage,
    });
  }

  public setCookie<T>(
    response: Response,
    name: string,
    value: T,
    options: CookieOptions,
  ) {
    response.cookie(name, value, options);
  }

  public clearCookie(
    response: Response,
    name: string,
    options?: CookieOptions,
  ) {
    response.clearCookie(name, options);
  }
}

export class ResponseOption {
  total?: number;
  message?: string;
  code?: string;
  extraData?: any;
  status?: HttpStatus;
  page?: number;
  perPage?: number;

  constructor(data?: Partial<ResponseOption>) {
    this.total = data?.total;
    this.message = data?.message || MESSAGE_CONSTANT.SUCCESS;
    this.code = data?.code || 'ok';
    this.extraData = data?.extraData;
    this.status = data?.status || HttpStatus.OK;
    this.page = data?.page;
    this.perPage = data?.perPage;
  }
}
