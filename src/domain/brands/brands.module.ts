import { Module } from '@nestjs/common';
import { BrandsController } from './controllers';
import { BrandsService } from './services';
import { RankProductsModule } from '../rank-products';

@Module({
  imports: [RankProductsModule],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
