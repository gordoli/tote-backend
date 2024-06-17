import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { CreateRankProductDTO, ListRankProductDTO } from '../dto';
import { RankProductsService } from '../services';

@Controller('user/rank-products')
@UseGuards(JwtAuthUserGuard)
export class UserRankProductsController extends BaseController {
  constructor(private _ratingService: RankProductsService) {
    super();
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

  @Get()
  public async myRatings(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Query() dto: ListRankProductDTO,
  ) {
    dto.createdBy = user.id;
    const { items, total } = await this._ratingService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
