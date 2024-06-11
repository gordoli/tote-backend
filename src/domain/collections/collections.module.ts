import { Module } from '@nestjs/common';
import { UserCollectionsController } from './controllers';
import { CollectionsService } from './services';

@Module({
  controllers: [UserCollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
