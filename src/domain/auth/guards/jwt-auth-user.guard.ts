import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  ERROR_CODE_CONSTANT,
  JWT_CONSTANT,
  MESSAGE_CONSTANT,
} from 'src/constants';
import { LoggerService } from 'src/core';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class JwtAuthUserGuard extends AuthGuard(
  JWT_CONSTANT.STRATEGIES.USER_TOKEN,
) {
  private _logger = new LoggerService(JwtAuthUserGuard.name);
  constructor(private _reflector: Reflector) {
    super();
  }
  public async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this._reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    } else {
      this._logger.error('INVALID JWT ERROR');
      const code = ERROR_CODE_CONSTANT.USER.NOT_FOUND;
      const message = MESSAGE_CONSTANT.USER.NOT_FOUND;
      HttpExceptionFilter.throwError(
        {
          code,
          message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await super.canActivate(context);
  }
}
