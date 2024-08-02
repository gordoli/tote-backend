import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { OtpService, AuthUserService, UserSocialService } from './services';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtService, AuthUserService, UserSocialService, OtpService],
  exports: [JwtService, AuthUserService, OtpService, UserSocialService],
})
export class AuthModule {}
