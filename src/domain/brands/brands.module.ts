import { Module } from '@nestjs/common';
import { BrandsController, UserBrandsController } from './controllers';
import { BrandsService } from './services';

@Module({
  controllers: [UserBrandsController, BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
