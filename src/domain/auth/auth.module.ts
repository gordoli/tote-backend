import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './controllers';
import {
  OtpService,
  TokenService,
  AuthUserService,
  UserSocialService,
} from './services';
import { JwtRefreshUserStrategy, JwtUserStrategy } from './strategies';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthUserService,
    JwtUserStrategy,
    JwtRefreshUserStrategy,
    TokenService,
    UserSocialService,
    OtpService,
  ],
  exports: [
    JwtService,
    AuthUserService,
    JwtUserStrategy,
    JwtRefreshUserStrategy,
    TokenService,
    OtpService,
    UserSocialService,
  ],
})
export class AuthModule {}
