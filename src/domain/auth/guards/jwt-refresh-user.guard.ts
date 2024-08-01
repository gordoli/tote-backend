import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ERROR_CODE_CONSTANT, JWT_CONSTANT } from 'src/constants';
import { LoggerService } from 'src/core';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class JwtAuthRefreshUserGuard extends AuthGuard(
  JWT_CONSTANT.STRATEGIES.REFRESH_USER_TOKEN,
) {
  private _logger = new LoggerService(JwtAuthRefreshUserGuard.name);
  public async canActivate(context: ExecutionContext): Promise<any> {
    try {
      return await super.canActivate(context);
    } catch (error: any) {
      this._logger.error('INVALID JWT ERROR', error);
      HttpExceptionFilter.throwError(
        {
          code: error?.response?.code || ERROR_CODE_CONSTANT.USER.NOT_FOUND,
          message: error?.response?.message || error?.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
