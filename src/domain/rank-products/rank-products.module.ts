import { Global, Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { RankProductsService } from './services';

@Global()
@Module({
  controllers: [ProductsController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
