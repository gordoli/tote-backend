import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers';
import { NotificationsService } from './services';
import { RankProductRepository } from 'src/database';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, RankProductRepository],
})
export class NotificationsModule {}
