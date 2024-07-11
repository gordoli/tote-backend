import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import { UsersController } from './controllers';
import { UsersService } from './services';
import { RankProductsModule } from '../rank-products';

@Module({
  imports: [BrandsModule, RankProductsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
