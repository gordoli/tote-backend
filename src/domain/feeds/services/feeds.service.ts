import { Injectable } from '@nestjs/common';
import { get, keyBy } from 'lodash';
import {
  FEED_TYPE,
  Feed,
  FeedRepository,
  Product,
  User,
  Wishlist,
} from 'src/database';
import { ProductsService } from 'src/domain/products';
import { WishlistService } from 'src/domain/wishlists';
import { ListFeedsDTO } from '../dto';

@Injectable()
export class FeedsService {
  constructor(
    private _feedRepository: FeedRepository,
    private _wishListService: WishlistService,
    private _productService: ProductsService,
  ) {}

  public async createRatingFeed(product: Product, user: User) {
    const instance = new Feed({
      createdBy: user,
      type: FEED_TYPE.RANK_PRODUCT,
      title: product.name,
    });
    return this._feedRepository.save(instance);
  }

  public async createWishlistFeed(wishList: Wishlist, user: User) {
    const instance = new Feed({
      createdBy: user,
      type: FEED_TYPE.WISHLIST,
    });
    return this._feedRepository.save(instance);
  }

  public async deleteWishlistFeed(wishList: Wishlist, user: User) {
    return this._feedRepository.delete({
      createdBy: { id: user.id },
      type: FEED_TYPE.WISHLIST,
    });
  }

  public async list(dto: ListFeedsDTO) {
    const [items, total] = await this._feedRepository.list(dto);
    return { items, total };
  }
}
