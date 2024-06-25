import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { WishListProductDTO } from '../dto';
import { WishListService } from '../services';
import { User } from 'src/database';

@Controller('wishlist')
@UseGuards(JwtAuthUserGuard)
export class WishListController extends BaseController {
  constructor(private _wishListService: WishListService) {
    super();
  }

  @Get(':userId')
  public async list(
    @Param('userId') userId: number,
    @Query() dto: WishListProductDTO,
    @Res() response: Response,
  ) {
    dto.user = userId;
    const { items, total } = await this._wishListService.wishListProducts(dto);
    this.responseCustom(response, items, { total });
  }

  @Post('add/:productId')
  public async add(
    @CurrentUser() user: User,
    @Param('productId') productId: number,
    @Res() response: Response,
  ) {
    const rankProduct = await this._wishListService.addProduct(user, productId);
    this.responseCustom(response, rankProduct);
  }
}
