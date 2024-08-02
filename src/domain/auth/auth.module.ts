import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { OtpService, AuthUserService, UserSocialService } from './services';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthUserService, UserSocialService, OtpService],
  exports: [AuthUserService, OtpService, UserSocialService],
})
export class AuthModule {}
