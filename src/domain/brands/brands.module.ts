import { Module } from '@nestjs/common';
import { BrandsController } from './controllers';
import { BrandsService } from './services';
import { ProductsModule } from '../rank-products';

@Module({
  imports: [ProductsModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
