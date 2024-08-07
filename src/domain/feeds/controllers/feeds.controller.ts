import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { FeedsService } from '../services';
import { ListFeedsDTO } from '../dto';
import { Response } from 'express';
import { User } from 'src/database';

@Controller('feeds')
@UseGuards(JwtAuthUserGuard)
export class FeedsController extends BaseController {
  constructor(private _feedsService: FeedsService) {
    super();
  }

  @Get()
  public async list(
    @Query() dto: ListFeedsDTO,
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
      console.log('Current User:', user);
    }
    const { items, total } = await this._feedsService.list(dto);
    await this._feedsService.mapWishListed(items, user.id);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
