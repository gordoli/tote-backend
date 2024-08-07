import { Module } from '@nestjs/common';
import { FollowsController } from './controllers';
import { FollowsService } from './services';
import { NotificationsService } from 'src/domain/notifications';

@Module({
  controllers: [FollowsController],
  providers: [FollowsService, NotificationsService],
})
export class FollowsModule {}
