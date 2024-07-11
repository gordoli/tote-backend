import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import {
  CreateRankProductDTO,
  ListRankProductDTO,
  UpdateRankProductDTO,
} from '../dto';
import { RankProductsService } from '../services';

@Controller('products')
@UseGuards(JwtAuthUserGuard)
export class ProductsController extends BaseController {
  constructor(private _rankProductsService: RankProductsService) {
    super();
  }

  @Get()
  public async list(
    @CurrentUser() user: User,
    @Query() dto: ListRankProductDTO,
    @Res() response: Response,
  ) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }

    const { items, total } = await this._rankProductsService.list(dto);
    await this._rankProductsService.mapWishlisted(items, user.id);
    return this.responseCustom(response, items, {
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
    const rankProduct = await this._rankProductsService.create(dto, user);
    return this.responseCustom(response, rankProduct);
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: UpdateRankProductDTO,
  ) {
    const rankProduct = await this._rankProductsService.update(id, dto, user);
    return this.responseCustom(response, rankProduct);
  }
}
