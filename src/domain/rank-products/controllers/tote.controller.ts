import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { ListRankProductDTO } from '../dto';
import { RankProductsService } from '../services';

@Controller('tote')
@UseGuards(JwtAuthUserGuard)
export class ToteController extends BaseController {
  constructor(private _rankProductService: RankProductsService) {
    super();
  }

  @Get()
  public async list(
    @Query() dto: ListRankProductDTO,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    dto.createdBy = user.id;
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }
    const { items, total } = await this._rankProductService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
