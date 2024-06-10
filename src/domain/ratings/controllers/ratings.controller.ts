import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { BaseController } from 'src/library';
import { RatingsService } from '../services';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { ListRatingDTO } from '../dto';
import { User } from 'src/database';
import { Response } from 'express';

@Controller('ratings')
@UseGuards(JwtAuthUserGuard)
export class RatingsController extends BaseController {
  constructor(private _ratingService: RatingsService) {
    super();
  }

  @Get()
  public async list(
    @Query() dto: ListRatingDTO,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }
    const { items, total } = await this._ratingService.list(dto);
    this.responseCustom(
      response,
      items.map((el) => {
        if (typeof el.createdBy === 'object') {
          el.createdBy = new User(el.createdBy).mainInfo();
        }
        return el;
      }),
      {
        total,
        page: dto.page,
        perPage: dto.perPage,
      },
    );
  }
}
