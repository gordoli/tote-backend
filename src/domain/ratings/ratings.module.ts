import { Global, Module } from '@nestjs/common';
import { RatingsController, UserRatingsController } from './controllers';
import { RatingsService } from './services';

@Global()
@Module({
  controllers: [RatingsController, UserRatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
