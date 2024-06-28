import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import { UsersController } from './controllers';
import { UsersService } from './services';

@Module({
  imports: [BrandsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
