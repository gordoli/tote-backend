import { Module } from '@nestjs/common';
import { SearchMembersController, UsersController } from './controllers';
import { UsersService } from './services';

@Module({
  controllers: [UsersController, SearchMembersController],
  providers: [UsersService],
})
export class UsersModule {}
