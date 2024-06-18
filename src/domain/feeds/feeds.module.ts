import { Global, Module } from '@nestjs/common';
import { FeedsService } from './services';
import { FeedsController } from './controllers';

@Global()
@Module({
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
