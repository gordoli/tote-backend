import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController, AuthUserSocialController } from './controllers';
import {
  AuthGoogleService,
  OtpService,
  TokenService,
  UserService,
  UserSocialService,
} from './services';
import { JwtRefreshUserStrategy, JwtUserStrategy } from './strategies';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController, AuthUserSocialController],
  providers: [
    JwtService,
    UserService,
    JwtUserStrategy,
    JwtRefreshUserStrategy,
    TokenService,
    UserSocialService,
    OtpService,
    AuthGoogleService,
  ],
  exports: [
    JwtService,
    UserService,
    JwtUserStrategy,
    JwtRefreshUserStrategy,
    TokenService,
    OtpService,
    UserSocialService,
    AuthGoogleService,
  ],
})
export class AuthModule {}
