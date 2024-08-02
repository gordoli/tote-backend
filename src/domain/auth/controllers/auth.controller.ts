import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { MESSAGE_CONSTANT } from 'src/constants';
import { User } from 'src/database';
import { BaseController } from 'src/library';
import { Public } from '../decorators';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegistrationDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  VerifyForgotPasswordDTO,
  VerifyOtpDto,
} from '../dto';
import { AuthUserService } from '../services';
import { OtpService } from '../services/otp.service';
import { SendOTPType } from '../types';
import {
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponse } from '../responses';
import { supabase } from 'src/main';
import * as supabaseJs from '@supabase/supabase-js';

@ApiTags('Auth')
@Controller('auth')
// TODO: AuthGuard
export class AuthController extends BaseController {
  constructor(
    private _userService: AuthUserService,
    private _otpService: OtpService,
  ) {
    super();
  }

  @Get('profile')
  public async profile(@CurrentUser() user: User, @Res() response: Response) {
    return this.responseCustom(response, user.serialize());
  }

  @Post('login')
  @Public()
  @ApiUnauthorizedResponse({
    description: 'User not found, or AuthApiError from Supabase',
    type: supabaseJs.AuthApiError,
  })
  @ApiInternalServerErrorResponse({ description: 'Unknown auth errors' })
  public async login(
    @Body() loginDto: LoginDTO,
  ): Promise<
    LoginResponse<supabaseJs.User, supabaseJs.Session, supabaseJs.WeakPassword>
  > {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (supabaseJs.isAuthApiError(error)) {
      if (error.code == 'user_not_found') {
        throw new UnauthorizedException();
      } else {
        throw new UnauthorizedException(`${error}`);
      }
    } else if (error) {
      throw new InternalServerErrorException(
        `Unhandled unknown error: ${error}`,
      );
    }

    return data;
  }

  @Post('logout')
  public async logout(@Res() response: Response, @CurrentUser() user: User) {
    await this._userService.logout(user);
    return this.responseCustom(response);
  }

  @Post('change-password')
  public async changePassword(
    @Res() response: Response,
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDTO,
  ) {
    await this._userService.changePassword(user, dto);
    return this.responseCustom(response);
  }

  @Post('forgot-password')
  @Public()
  public async forgotPassword(
    @Res() response: Response,
    @Body() dto: ForgotPasswordDTO,
  ) {
    const sessionID = this._request.sessionID;
    await this._userService.forgotPassword(dto, sessionID);
    return this.responseCustom(
      response,
      { sessionID },
      {
        message: MESSAGE_CONSTANT.OTP.SENT_TO_EMAIL,
      },
    );
  }

  @Post('forgot-password/verify')
  @Public()
  public async verifyForgotPassword(
    @Res() response: Response,
    @Body() dto: VerifyForgotPasswordDTO,
  ) {
    const key = `${SendOTPType.FORGOT_PASSWORD}_${dto.sessionID}_${dto.otp}_${dto.email}`;
    await this._otpService.validateOtp(key);
    await this._userService.verifyForgotPassword(dto);
    await this._otpService.delOtp(key);
    return this.responseCustom(response);
  }

  @Post('reset-password')
  @Public()
  public async resetPassword(
    @Res() response: Response,
    @Body() dto: ResetPasswordDTO,
  ) {
    await this._userService.resetPassword(dto);
    return this.responseCustom(response, undefined, {
      message: MESSAGE_CONSTANT.USER.MAIL_NEW_PASSWORD,
    });
  }

  @Post('resend-otp')
  @Public()
  public async resendOtp(@Res() response: Response, @Body() dto: ResendOtpDTO) {
    const sessionID = this._request.sessionID;
    await this._userService.sendOTP(dto.email, sessionID, dto.type);
    return this.responseCustom(
      response,
      { sessionID },
      {
        message: MESSAGE_CONSTANT.OTP.SENT_TO_EMAIL,
      },
    );
  }

  @Post('registration')
  @Public()
  public async registration(
    @Body() registerDto: RegistrationDTO,
    @Res() response: Response,
  ) {
    const sessionID = this._request.sessionID;
    await this._userService.registration(registerDto, sessionID);
    return this.responseCustom(
      response,
      {
        sessionID,
      },
      {
        message: MESSAGE_CONSTANT.OTP.SENT_TO_EMAIL,
      },
    );
  }

  @Post('verify')
  @Public()
  public async verifyEmail(
    @Body() dto: VerifyOtpDto,
    @Res() response: Response,
  ) {
    const key = `${SendOTPType.VERIFY_EMAIL}_${dto.sessionID}_${dto.otp}_${dto.email}`;
    await this._otpService.validateOtp(key);
    await this._userService.verifyEmail(dto.email);
    await this._otpService.delOtp(key);
    return this.responseCustom(response, undefined, {
      message: MESSAGE_CONSTANT.SUCCESS,
    });
  }
}
