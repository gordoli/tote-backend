import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { FeedActivitiesService } from '../services';
import { ListFeedActivitiesDTO } from '../dto';
import { Response } from 'express';
import { User } from 'src/database';

@Controller('user/feed-activities')
@UseGuards(JwtAuthUserGuard)
export class UserFeedActivitiesController extends BaseController {
  constructor(private _feedActivitiesService: FeedActivitiesService) {
    super();
  }

  @Get()
  public async list(
    @Query() dto: ListFeedActivitiesDTO,
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }
    const { items, total } = await this._feedActivitiesService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
