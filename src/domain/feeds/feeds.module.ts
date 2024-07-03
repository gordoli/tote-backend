import { Global, Module } from '@nestjs/common';
import { FeedsService } from './services';
import { FeedsController } from './controllers';
import { WishListsModule } from '../wish-lists';

@Global()
@Module({
  imports: [WishListsModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
