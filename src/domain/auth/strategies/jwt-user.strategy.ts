import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANT } from 'src/constants';
import { User } from 'src/database';

import { JwtPayload } from 'jsonwebtoken';
import { AuthUserService } from '../services';
@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  JWT_CONSTANT.STRATEGIES.USER_TOKEN,
) {
  constructor(private _userService: AuthUserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_USER_JWT,
    });
  }
  public async validate(payload: Partial<User & JwtPayload>) {
    await this._userService.validateTokenIat(payload.id, payload.iat);
    return payload;
  }
}
