import { Module } from '@nestjs/common';
import { WishlistsModule } from '../wishlists';
import { ProductsController } from './controllers';
import { ProductsService } from './services';

@Module({
  imports: [WishlistsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
