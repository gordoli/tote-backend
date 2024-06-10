import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard, Public } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { UsersService } from '../services';

@Controller('users')
@UseGuards(JwtAuthUserGuard)
export class UsersController extends BaseController {
  constructor(private _usersService: UsersService) {
    super();
  }

  @Get('me')
  public async me(@CurrentUser() user: User, @Res() response: Response) {
    const serializedUser = new User(user);
    await this._usersService.mapUserStatistics(serializedUser);
    return this.responseCustom(response, serializedUser);
  }

  @Get(':id')
  @Public()
  public async profile(@Param('id') id: number, @Res() response: Response) {
    const user = await this._usersService.getUserById(id);
    const serializedUser = new User(user.serialize());
    await this._usersService.mapUserStatistics(serializedUser);
    return this.responseCustom(response, serializedUser);
  }
}
