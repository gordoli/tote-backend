import { Global, Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { RankProductsService } from './services';
import { WishListsModule } from '../wish-lists';

@Global()
@Module({
  imports: [WishListsModule],
  controllers: [ProductsController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
