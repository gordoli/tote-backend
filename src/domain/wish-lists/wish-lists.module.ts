import { Module } from '@nestjs/common';
import { WishListController, WishListsController } from './controllers';
import { WishListService } from './services';

@Module({
  controllers: [WishListsController, WishListController],
  providers: [WishListService],
})
export class WishListsModule {}
