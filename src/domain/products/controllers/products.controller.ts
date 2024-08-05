import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';

import { User } from 'src/database';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { CreateProductDTO, ListProductDTO, UpdateProductDTO } from '../dto';
import { ProductsService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
// TODO: AuthGuard
export class ProductsController extends BaseController {
  constructor(private _productsService: ProductsService) {
    super();
  }

  @Get()
  public async list(@CurrentUser() user: User, @Query() dto: ListProductDTO) {
    if (dto.isOnlyFriend) {
      dto.userId = user.id;
    }

    const { items } = await this._productsService.list(dto);
    await this._productsService.mapWishlisted(items, user.id);
    return items;
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() dto: CreateProductDTO,
  ) {
    const product = await this._productsService.create(dto, user);
    return product;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateProductDTO,
  ) {
    const product = await this._productsService.update(id, dto, user);
    return product;
  }
}
