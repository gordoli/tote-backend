import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import { UsersController } from './controllers';
import { UsersService } from './services';
import { ProductsModule } from '../rank-products';

@Module({
  imports: [BrandsModule, ProductsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
