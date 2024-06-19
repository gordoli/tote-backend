import { HttpStatus, Injectable } from '@nestjs/common';
import {
  ERROR_CODE_CONSTANT,
  MESSAGE_CONSTANT,
  OTP_CONSTANT,
} from 'src/constants';
import { LoggerService } from 'src/core';
import { ICachingService, InjectCaching } from 'src/core/redis';
import { User } from 'src/database';
import { HttpExceptionFilter } from 'src/library';
import { genOtp } from 'src/utils';
import { SendOTPType } from '../types';

@Injectable()
export class OtpService {
  private _logger = new LoggerService(OtpService.name);
  constructor(@InjectCaching() private _cachingService: ICachingService) {}

  public async create(user: User) {
    const otp = genOtp();
    const key = `${otp}_${user.email}`;
    await this._cachingService.set(key, user.email, OTP_CONSTANT.SMS_TTL);
    return otp;
  }

  public async createOtpSession(
    email: string,
    sessionId: string,
    type: SendOTPType,
  ) {
    const otp = genOtp();
    let otpCacheKey = `${sessionId}_${otp}_${email}`;
    if (type) {
      otpCacheKey = `${type}_${otpCacheKey}`;
    }
    this._logger.debug('Otp session cache key ', otpCacheKey);
    await this._cachingService.set(
      otpCacheKey.toLowerCase(),
      email.toLowerCase(),
      OTP_CONSTANT.SESSION_TTL,
    );
    return { otp };
  }

  public async validateOtp(key: string) {
    const value = await this._cachingService.get<string>(key.toLowerCase());
    if (!value) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.OTP.INVALID,
          message: MESSAGE_CONSTANT.OTP.INVALID,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return value;
  }

  public async delOtp(key: string) {
    await this._cachingService.del(key);
  }
}
