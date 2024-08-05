import { Controller, Get, Query, Res } from '@nestjs/common';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { FeedsService } from '../services';
import { ListFeedsDTO } from '../dto';
import { Response } from 'express';
import { User } from 'src/database';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Feeds')
@Controller('feeds')
// TODO: AuthGuard
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
    }
    const { items, total } = await this._feedsService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
