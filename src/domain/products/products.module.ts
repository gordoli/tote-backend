import { Module } from '@nestjs/common';
import { WishListsModule } from '../wish-lists';
import { ProductsController } from './controllers';
import { ProductsService } from './services';

@Module({
  imports: [WishListsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
