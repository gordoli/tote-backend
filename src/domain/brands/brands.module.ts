import { Module } from '@nestjs/common';
import { BrandsController } from './controllers';
import { BrandsService } from './services';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
