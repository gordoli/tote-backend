import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthUserService } from './services';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthUserService],
  exports: [AuthUserService],
})
export class AuthModule {}
