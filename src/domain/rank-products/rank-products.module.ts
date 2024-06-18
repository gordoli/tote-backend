import { Global, Module } from '@nestjs/common';
import { RankProductsController, ToteController } from './controllers';
import { RankProductsService } from './services';

@Global()
@Module({
  controllers: [RankProductsController, ToteController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
