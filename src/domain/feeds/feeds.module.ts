import { Global, Module } from '@nestjs/common';
import { FeedsService } from './services';
import { UserFeedsController } from './controllers';

@Global()
@Module({
  controllers: [UserFeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
