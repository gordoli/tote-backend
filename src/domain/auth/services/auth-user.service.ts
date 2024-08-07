import { HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import {
  ERROR_CODE_CONSTANT,
  EVENTS,
  JWT_CONSTANT,
  MESSAGE_CONSTANT,
  USER_CONSTANT,
} from 'src/constants';
import { ICachingService, InjectCaching, LoggerService } from 'src/core';
import { MAIL_TYPE_KEYS } from 'src/core/mail/constant';
import { BaseStatus, User, UserRepository } from 'src/database';
import { SendMailPayload } from 'src/event-handler/types';
import { HttpExceptionFilter } from 'src/library';
import { comparePasswords, hashPassword, makeId, mapNumber } from 'src/utils';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegistrationDTO,
  ResetPasswordDTO,
  VerifyForgotPasswordDTO,
} from '../dto';
import { SendOTPType } from '../types';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthUserService {
  private _logger = new LoggerService(AuthUserService.name);
  constructor(
    private _userRepository: UserRepository,
    private _tokenService: TokenService,
    private _otpService: OtpService,
    private _eventEmitter: EventEmitter2,
    @InjectCaching() private _cachingService: ICachingService,
  ) {}

  public async getProfile(payload: Partial<User>) {
    return this._userRepository.findOneBy({ id: payload.id });
  }

  public async validateRefreshToken(
    payload: Partial<User>,
    refreshToken: string,
  ) {
    return this._userRepository.findOneBy({ id: payload.id, refreshToken });
  }

  public async refreshAccessToken(user: User) {
    const jwt = await this._tokenService.genToken(user);
    return {
      user: user,
      accessToken: jwt,
    };
  }

  public async login(loginDto: LoginDTO) {
    const user = await this.validateUser(loginDto);
    return this.loginResponse(user);
  }

  public async loginResponse(user: User) {
    const { accessToken, refreshToken } =
      await this._tokenService.updateUserToken(user);
    return {
      user: new User(user),
      accessToken,
      refreshToken,
    };
  }

  public async logout(user: User) {
    await this._cachingService.hSet(
      USER_CONSTANT.CACHE_KEY.LAST_LOGGED_OUT,
      'user:' + user.id,
      Date.now(),
      JWT_CONSTANT.ACCESS_TOKEN_EXPIRE,
    );
    await this._tokenService.deleteUserToken(user);
    return true;
  }

  public async validateTokenIat(userId: string, iat: number) {
    let lastLoggedOut = await this._cachingService.hGet<number>(
      USER_CONSTANT.CACHE_KEY.LAST_LOGGED_OUT,
      'user:' + userId,
    );
    lastLoggedOut = mapNumber(lastLoggedOut);
    if (iat < lastLoggedOut) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.TOKEN_EXPIRED,
          message: MESSAGE_CONSTANT.USER.TOKEN_EXPIRED,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  public async changePassword(user: User, dto: ChangePasswordDTO) {
    const password = await this._userRepository.getPasswordById(user.id);
    if (!comparePasswords(dto.currentPassword, password)) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.WRONG_CURRENT_PASSWORD,
          message: MESSAGE_CONSTANT.USER.WRONG_CURRENT_PASSWORD,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this._userRepository.updatePasswordById(
      user.id,
      hashPassword(dto.newPassword),
    );
  }

  public async forgotPassword(dto: ForgotPasswordDTO, sessionID: string) {
    const { email } = dto;
    await this.findUserByEmail(email);
    return this.sendOTP(email, sessionID, SendOTPType.FORGOT_PASSWORD);
  }

  public async verifyForgotPassword(dto: VerifyForgotPasswordDTO) {
    const { newPassword, email } = dto;
    const password = hashPassword(newPassword);
    const result = await this._userRepository.updatePasswordByEmail(
      email,
      password,
    );
    this._logger.debug('Verified forgot password result', result);
    return result;
  }

  public async resetPassword(dto: ResetPasswordDTO) {
    const user = await this.findUserByEmail(dto.email);
    const newPassword = makeId(8);
    const password = hashPassword(newPassword);
    const result = await this._userRepository.update(
      { id: user.id },
      { password },
    );
    this._logger.debug('Reset password result', result);

    this._eventEmitter.emit(
      EVENTS.SEND_MAIL,
      new SendMailPayload({
        data: { to: user.email, data: { newPassword } },
        key: MAIL_TYPE_KEYS.RESET_PASSWORD,
      }),
    );
  }

  public async validateUser(loginDto: LoginDTO) {
    const { username, password } = loginDto;
    const user = await this._userRepository.findByIdentity(username);
    if (!user) {
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
    if (!comparePasswords(password, user.password)) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.WRONG_PASSWORD,
          message: MESSAGE_CONSTANT.USER.WRONG_PASSWORD,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new User(user);
  }

  public async registration(registerDto: RegistrationDTO, sessionID: string) {
    const user = new User(registerDto);
    const existedUser = await this._userRepository.findByLowerEmail(user.email);
    if (existedUser && !existedUser.deletedAt) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.USER_ALREADY_EXISTS,
          message: MESSAGE_CONSTANT.USER.USER_ALREADY_EXISTS,
        },
        HttpStatus.CONFLICT,
      );
    }
    user.password = hashPassword(registerDto.password);
    user.username = await this.uniqUsername(registerDto.email);
    await this._userRepository.save(user);
    return this.sendOTP(user.email, sessionID, SendOTPType.VERIFY_EMAIL);
  }

  public async uniqUsername(email: string) {
    const username = User.getUsernameByEmail(email);
    const foundUsers = await this._userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :username', {
        username: `${username?.toLowerCase() || ''}%`,
      })
      .andWhere('user.deletedAt ISNULL')
      .select(['user.id', 'user.username'])
      .getMany();

    const foundUsernames = foundUsers.map((el) => el.username);
    this._logger.debug('Found username for uniq username', foundUsernames);
    let uniqUsername: string;
    while (true) {
      uniqUsername = `${username}_${randomUUID().split('-')[0]}`;
      const existedUsername = foundUsernames.some(
        (el) => el.toLowerCase() === uniqUsername?.toLowerCase(),
      );
      if (existedUsername) {
        continue;
      } else {
        break;
      }
    }
    this._logger.debug('Uniq username', uniqUsername);
    return uniqUsername;
  }

  public async verifyEmail(email: string) {
    const result = await this._userRepository.verifyByEmail(email);
    this._logger.debug('Verified update result', result);
  }

  public async sendOTP(email: string, sessionID: string, type: SendOTPType) {
    const { otp } = await this._otpService.createOtpSession(
      email,
      sessionID,
      type,
    );
    const payload = new SendMailPayload({
      data: { to: email, data: { otp } },
    });
    switch (type) {
      case SendOTPType.FORGOT_PASSWORD:
        payload.key = MAIL_TYPE_KEYS.FORGOT_PASSWORD;
        break;

      case SendOTPType.VERIFY_EMAIL:
        payload.key = MAIL_TYPE_KEYS.VERIFY_EMAIL;
        break;

      default:
        break;
    }
    this._eventEmitter.emit(EVENTS.SEND_MAIL, payload);
    return { otp };
  }

  public async findUserByEmail(email: string) {
    const existedUser = await this._userRepository.findByLowerEmail(email);
    if (!existedUser || existedUser.deletedAt) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.NOT_FOUND,
          message: ERROR_CODE_CONSTANT.USER.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return existedUser;
  }
}
