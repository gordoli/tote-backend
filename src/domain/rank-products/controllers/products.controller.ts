import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { ListRankProductDTO } from '../dto';
import { RankProductsService } from '../services';

@Controller('products')
@UseGuards(JwtAuthUserGuard)
export class ProductsController extends BaseController {
  constructor(private _ratingService: RankProductsService) {
    super();
  }

  @Get(':categoryId')
  public async list(
    @Param('categoryId') categoryId: number,
    @Query() dto: ListRankProductDTO,
    @Res() response: Response,
  ) {
    dto.category = categoryId;
    const { items, total } = await this._ratingService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
