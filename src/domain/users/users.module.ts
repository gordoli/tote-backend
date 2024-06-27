import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands';
import {
  SearchMembersController,
  UserController,
  UsersController,
} from './controllers';
import { UsersService } from './services';

@Module({
  imports: [BrandsModule],
  controllers: [UsersController, SearchMembersController, UserController],
  providers: [UsersService],
})
export class UsersModule {}
