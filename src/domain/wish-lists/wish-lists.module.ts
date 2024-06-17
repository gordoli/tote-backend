import { Module } from '@nestjs/common';
import { UserWishListsController } from './controllers';
import { WishListService } from './services';

@Module({
  controllers: [UserWishListsController],
  providers: [WishListService],
})
export class WishListsModule {}
