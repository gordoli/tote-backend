import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { WishlistProductDTO } from '../dto';
import { WishlistService } from '../services';
import { User } from 'src/database';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('wishlist')
// TODO: AuthGuard
export class WishlistController extends BaseController {
  constructor(private _wishListService: WishlistService) {
    super();
  }

  @Get(':userId')
  public async list(
    @Param('userId') userId: string,
    @Query() dto: WishlistProductDTO,
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
    const product = await this._wishListService.addProduct(user, productId);
    this.responseCustom(response, product);
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
