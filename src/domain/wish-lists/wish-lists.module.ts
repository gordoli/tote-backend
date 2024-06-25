import { Module } from '@nestjs/common';
import { WishListController } from './controllers';
import { WishListService } from './services';

@Module({
  controllers: [WishListController],
  providers: [WishListService],
})
export class WishListsModule {}
