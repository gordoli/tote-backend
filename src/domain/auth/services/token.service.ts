import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from 'src/constants';
import { User, UserRepository } from 'src/database';

@Injectable()
export class TokenService {
  constructor(
    private readonly _jwtService: JwtService,
    private _userRepository: UserRepository,
  ) {}
  public async genToken(user: User) {
    const expiresIn = JWT_CONSTANT.ACCESS_TOKEN_EXPIRE;
    const token = await this._jwtService.signAsync(new User(user).serialize(), {
      secret: process.env.SECRET_USER_JWT,
      expiresIn,
    });
    return {
      token,
      expiresIn,
    };
  }

  public async genRefreshToken(user: User) {
    const iat = Date.now() / 1000;
    const expiresIn = Math.round(iat + JWT_CONSTANT.EXPIRE_SECONDS);
    const token = await this._jwtService.signAsync(
      { id: user.id },
      {
        secret: process.env.REFRESH_SECRET_USER_JWT,
        expiresIn,
      },
    );
    return {
      token,
      expiresIn,
    };
  }

  public async updateUserToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.genToken(user),
      this.genRefreshToken(user),
    ]);
    await this._userRepository.updateRefreshToken(user.id, refreshToken.token);
    return {
      accessToken,
      refreshToken,
    };
  }

  public async deleteUserToken(user: User) {
    return this._userRepository.deleteRefreshToken(user.id);
  }
}
