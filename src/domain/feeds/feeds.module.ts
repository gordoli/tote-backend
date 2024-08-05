import { Module } from '@nestjs/common';
import { ProductsModule } from '../rank-products';
import { WishListsModule } from '../wish-lists';
import { FeedsController } from './controllers';
import { FeedsService } from './services';

@Module({
  imports: [WishListsModule, ProductsModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
