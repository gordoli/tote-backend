import { Global, Module } from '@nestjs/common';
import {
  RankProductsController,
  UserRankProductsController,
} from './controllers';
import { RankProductsService } from './services';

@Global()
@Module({
  controllers: [RankProductsController, UserRankProductsController],
  providers: [RankProductsService],
  exports: [RankProductsService],
})
export class RankProductsModule {}
