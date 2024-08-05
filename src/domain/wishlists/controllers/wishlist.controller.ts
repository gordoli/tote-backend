import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';

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
  ) {
    const { items } = await this._wishListService.userWishlistProducts(
      userId,
      dto,
    );
    return { items: items.map((item) => item.product) };
  }

  @Post(':productId')
  public async add(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
  ) {
    this._wishListService.addProduct(user, productId);
  }

  @Delete(':productId')
  public async delete(
    @CurrentUser() user: User,
    @Param('productId') productId: string,
  ) {
    const result = await this._wishListService.deleteProduct(user, productId);
    return { affected: result?.affected };
  }
}
