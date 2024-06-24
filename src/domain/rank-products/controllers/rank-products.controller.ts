import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BaseController } from 'src/library';
import { RankProductsService } from '../services';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { CreateRankProductDTO, ListRankProductDTO } from '../dto';
import { User } from 'src/database';
import { Response } from 'express';

@Controller('rank-products')
@UseGuards(JwtAuthUserGuard)
export class RankProductsController extends BaseController {
  constructor(private _ratingService: RankProductsService) {
    super();
  }

  @Get()
  public async list(
    @Query() dto: ListRankProductDTO,
    @CurrentUser() user: User,
    @Res() response: Response,
  ) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }
    const { items, total } = await this._ratingService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: CreateRankProductDTO,
  ) {
    const rankProduct = await this._ratingService.create(dto, user);
    this.responseCustom(response, rankProduct);
  }
}
