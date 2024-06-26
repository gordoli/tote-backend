import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserProvider } from 'src/database';
import { BaseController } from 'src/library';
import { AuthGoogleLoginDto } from '../dto';
import { UserSocialService } from '../services';
import { AuthGoogleService } from '../services/auth-google.service';

@Controller('auth/social')
export class AuthUserSocialController extends BaseController {
  constructor(
    private _authGoogleService: AuthGoogleService,
    private _userSocialService: UserSocialService,
  ) {
    super();
  }

  @Post('google/login')
  public async googleLogin(
    @Res() response: Response,
    @Body() dto: AuthGoogleLoginDto,
  ) {
    const socialData = await this._authGoogleService.getProfileByToken(dto);
    const { accessToken, refreshToken, user } =
      await this._userSocialService.socialLogin(
        socialData,
        UserProvider.GOOGLE,
      );
    return this.responseCustom(response, {
      user: user.serialize(),
      accessToken,
      refreshToken,
    });
  }

  /**
   * API to test flow get token and add to body POST google/login {1}
   */
  @Get('google/token')
  public async token(@Res() response: Response) {
    const url = await this._authGoogleService.url();
    response.redirect(url);
  }

  /**
   * API to test flow get token and add to body POST google/login {2}
   */
  @Get('google/callback')
  public async callback(
    @Res() response: Response,
    @Query() dto: { code: string },
  ) {
    const url = await this._authGoogleService.getToken(dto.code);
    this.responseCustom(response, { url });
  }
}
