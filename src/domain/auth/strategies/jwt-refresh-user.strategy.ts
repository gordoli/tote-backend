import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ERROR_CODE_CONSTANT,
  JWT_CONSTANT,
  MESSAGE_CONSTANT,
} from 'src/constants';
import { LoggerService } from 'src/core';
import { BaseStatus, User } from 'src/database';
import { HttpExceptionFilter } from 'src/shared';
import { UserService } from '../services';

@Injectable()
export class JwtRefreshUserStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.REFRESH_USER_TOKEN,
) {
  private _logger = new LoggerService(JwtRefreshUserStrategy.name);
  constructor(private _userService: UserService) {
    super({
      secretOrKey: process.env.REFRESH_SECRET_USER_JWT,
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshUserStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  private static extractJWT(request: Request): string | null {
    return request.body.refreshToken;
  }

  public async validate(request: Request, payload: Partial<User>) {
    const token = JwtRefreshUserStrategy.extractJWT(request);
    const user = await this._userService.validateRefreshToken(payload, token);

    if (user?.deletedAt) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.NOT_FOUND,
          message: MESSAGE_CONSTANT.USER.NOT_FOUND,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.status === BaseStatus.Inactive) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.DISABLED,
          message: MESSAGE_CONSTANT.USER.DISABLED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
