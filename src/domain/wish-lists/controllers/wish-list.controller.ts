import {
  Controller,
  Delete,
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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthUserGuard)
export class WishListController extends BaseController {
  constructor(private _wishListService: WishListService) {
    super();
  }

  @Get(':userId')
  public async list(
    @Param('userId') userId: string,
    @Query() dto: WishListProductDTO,
    @Res() response: Response,
  ) {
    const { items, total, user } =
      await this._wishListService.userWishlistProducts(userId, dto);
    this.responseCustom(
      response,
      { user, products: items.map((item) => item.product) },
      { total },
    );
  }

  @Post(':productId')
  public async add(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
    @Res() response: Response,
  ) {
    const rankProduct = await this._wishListService.addProduct(user, productId);
    this.responseCustom(response, rankProduct);
  }

  @Delete(':productId')
  public async delete(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
    @Res() response: Response,
  ) {
    const result = await this._wishListService.deleteProduct(user, productId);
    this.responseCustom(response, { affected: result?.affected });
  }
}
