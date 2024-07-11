import { Module } from '@nestjs/common';
import { WishListsModule } from '../wish-lists';
import { ProductsController } from './controllers';
import { RankProductsService } from './services';

@Module({
  imports: [WishListsModule],
  controllers: [ProductsController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
