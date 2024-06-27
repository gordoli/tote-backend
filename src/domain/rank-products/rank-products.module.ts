import { Global, Module } from '@nestjs/common';
import {
  ProductsController,
  RankProductsController,
  ToteController,
} from './controllers';
import { RankProductsService } from './services';

@Global()
@Module({
  controllers: [RankProductsController, ToteController, ProductsController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
