import { Module } from '@nestjs/common';
import { WishListsController } from './controllers';
import { WishListService } from './services';

@Module({
  controllers: [WishListsController],
  providers: [WishListService],
})
export class WishListsModule {}
