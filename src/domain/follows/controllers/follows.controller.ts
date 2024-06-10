import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController, BaseFilter } from 'src/library';
import { FollowsService } from '../services';

@Controller('follows')
@UseGuards(JwtAuthUserGuard)
export class FollowsController extends BaseController {
  constructor(private _followsService: FollowsService) {
    super();
  }

  @Get(':userId/following')
  public async userFollowing(
    @Res() response: Response,
    @Param('userId') userId: number,
    @Query() dto: BaseFilter,
  ) {
    const { items, total } = await this._followsService.userFollowing(
      userId,
      dto,
    );
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }

  @Get(':userId/followers')
  public async userFollowers(
    @Res() response: Response,
    @Param('userId') userId: number,
    @Query() dto: BaseFilter,
  ) {
    const { items, total } = await this._followsService.userFollowers(
      userId,
      dto,
    );
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }

  @Put('following/:userId')
  public async followUser(
    @Res() response: Response,
    @CurrentUser() user: User,
    @Param('userId') userId: number,
  ) {
    await this._followsService.followUser(user, userId);
    this.responseCustom(response);
  }

  @Delete('following/:userId')
  public async unFollowUser(
    @Res() response: Response,
    @CurrentUser() user: User,
    @Param('userId') userId: number,
  ) {
    await this._followsService.unFollowUser(user, userId);
    this.responseCustom(response);
  }
}
