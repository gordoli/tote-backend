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
import { User } from 'src/database';
import { BaseController } from 'src/library';
import { Public } from '../decorators';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  LoginDTO,
  RegistrationDTO,
  ResetPasswordDTO,
  VerifyForgotPasswordDTO,
  VerifyOtpDto,
} from '../dto';
import { AuthUserService } from '../services';
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
  constructor(private _userService: AuthUserService) {
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
}
