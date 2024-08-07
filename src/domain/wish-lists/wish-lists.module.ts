import { Module } from '@nestjs/common';
import { WishListController } from './controllers';
import { WishListService } from './services';
import { NotificationsService } from '../notifications';

@Module({
  controllers: [WishListController],
  providers: [WishListService, NotificationsService],
  exports: [WishListService],
})
export class WishListsModule {}
