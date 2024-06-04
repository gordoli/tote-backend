import { HttpStatus, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ERROR_CODE_CONSTANT, MESSAGE_CONSTANT } from 'src/constants';
import { HttpExceptionFilter } from 'src/shared';
import { AuthGoogleLoginDto } from '../dto';
import { SocialData } from '../types';
import { LoggerService } from 'src/core';

@Injectable()
export class AuthGoogleService {
  private _logger = new LoggerService(AuthGoogleService.name);
  private _oauth2Client: OAuth2Client;
  constructor() {
    this._oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:8080/api/auth/social/google/callback',
    );
  }

  public async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialData> {
    const ticket = await this._oauth2Client.verifyIdToken({
      idToken: loginDto.token,
      audience: [process.env.GOOGLE_CLIENT_ID],
    });

    const data = ticket.getPayload();

    if (!data) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.WRONG_TOKEN,
          message: MESSAGE_CONSTANT.USER.WRONG_TOKEN,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }

  public async url() {
    return this._oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
  }

  public async getToken(code: string) {
    try {
      const { tokens } = await this._oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      this._logger.error('Error when get token ', error.message);
    }
  }
}
