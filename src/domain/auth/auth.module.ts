import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { OtpService, AuthUserService } from './services';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthUserService, OtpService],
  exports: [AuthUserService, OtpService],
})
export class AuthModule {}
