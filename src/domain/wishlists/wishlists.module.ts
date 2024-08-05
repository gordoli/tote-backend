import { Module } from '@nestjs/common';
import { WishlistController } from './controllers';
import { WishlistService } from './services';

@Module({
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistsModule {}
