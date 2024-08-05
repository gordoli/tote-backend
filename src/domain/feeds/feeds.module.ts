import { Module } from '@nestjs/common';
import { ProductsModule } from '../products';
import { WishlistsModule } from '../wishlists';
import { FeedsController } from './controllers';
import { FeedsService } from './services';

@Module({
  imports: [WishlistsModule, ProductsModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
