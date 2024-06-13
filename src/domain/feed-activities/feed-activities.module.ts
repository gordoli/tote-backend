import { Global, Module } from '@nestjs/common';
import { FeedActivitiesService } from './services';
import { UserFeedActivitiesController } from './controllers';

@Global()
@Module({
  controllers: [UserFeedActivitiesController],
  providers: [FeedActivitiesService],
  exports: [FeedActivitiesService],
})
export class FeedActivitiesModule {}
