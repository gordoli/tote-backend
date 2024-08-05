import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { User } from 'src/database';
import { CurrentUser } from 'src/domain/auth';
import { BaseController, BaseFilter } from 'src/library';
import { FollowsService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Follows')
@Controller('follows')
// TODO: AuthGuard
export class FollowsController extends BaseController {
  constructor(private _followsService: FollowsService) {
    super();
  }

  @Get(':userId/following')
  public async userFollowing(
    @Param('userId') userId: string,
    @Query() dto: BaseFilter,
  ) {
    const { items } = await this._followsService.userFollowing(userId, dto);
    items;
  }

  @Get(':userId/followers')
  public async userFollowers(
    @Param('userId') userId: string,
    @Query() dto: BaseFilter,
  ) {
    const { items } = await this._followsService.userFollowers(userId, dto);
    return items;
  }

  @Put('following/:userId')
  public async followUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ) {
    await this._followsService.followUser(user, userId);
  }

  @Delete('following/:userId')
  public async unFollowUser(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
  ) {
    await this._followsService.unFollowUser(user, userId);
  }
}
