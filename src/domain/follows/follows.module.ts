import { Module } from '@nestjs/common';
import { FollowsController } from './controllers';
import { FollowsService } from './services';

@Module({
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
