import { Injectable } from '@nestjs/common';
import { get, keyBy } from 'lodash';
import {
  FEED_TYPE,
  Feed,
  FeedRepository,
  RankProduct,
  User,
  WishList,
} from 'src/database';
import { RankProductsService } from 'src/domain/rank-products';
import { WishListService } from 'src/domain/wish-lists';
import { ListFeedsDTO } from '../dto';

@Injectable()
export class FeedsService {
  constructor(
    private _feedRepository: FeedRepository,
    private _wishListService: WishListService,
    private _rankProductService: RankProductsService,
  ) {}

  public async createRatingFeed(rankProduct: RankProduct, user: User) {
    const instance = new Feed({
      referenceId: rankProduct.id,
      createdBy: user,
      type: FEED_TYPE.RANK_PRODUCT,
      title: rankProduct.name,
    });
    return this._feedRepository.save(instance);
  }

  public async createWishlistFeed(wishList: WishList, user: User) {
    const instance = new Feed({
      referenceId: wishList.id,
      createdBy: user,
      type: FEED_TYPE.WISHLIST,
    });
    return this._feedRepository.save(instance);
  }

  public async deleteWishlistFeed(wishList: WishList, user: User) {
    return this._feedRepository.delete({
      createdBy: { id: user.id },
      referenceId: wishList.id,
      type: FEED_TYPE.WISHLIST,
    });
  }

  public async list(dto: ListFeedsDTO) {
    const [items, total] = await this._feedRepository.list(dto);
    await this.mapRankProducts(items);
    return { items, total };
  }

  public async mapRankProducts(items: Feed[]) {
    const wishlistIds = items
      .filter((item) => item.type === FEED_TYPE.WISHLIST)
      .map((el) => el.referenceId);
    const rankProductItems = items
      .filter((item) => item.type === FEED_TYPE.RANK_PRODUCT)
      .map((el) => el.referenceId);
    const feedWishlists = await this._wishListService.feedWishlists(
      wishlistIds,
    );
    const dictionaryFeedWishlist = keyBy(feedWishlists, 'id');
    const productIds = [
      ...new Set(
        rankProductItems.concat(
          feedWishlists.map((el) => el.product?.id).filter(Boolean),
        ),
      ),
    ];
    const dictionaryRankProduct =
      await this._rankProductService.dictionaryByIds(productIds);

    for (const item of items) {
      if (item.type === FEED_TYPE.WISHLIST) {
        const wishlist = get(dictionaryFeedWishlist, item.referenceId);
        item.rankProduct = get(dictionaryRankProduct, wishlist?.product?.id);
      } else if (item.type === FEED_TYPE.RANK_PRODUCT) {
        item.rankProduct = get(dictionaryRankProduct, item.referenceId);
      }
    }
  }

  public async mapWishListed(items: Feed[], userId: string) {
    if (items.length) {
      const productIds = items.map((item) => item.rankProduct?.id);
      const dictionary = await this._wishListService.dictionaryUserProducts(
        productIds,
        userId,
      );

      for (const item of items) {
        if (item.rankProduct?.id) {
          item.rankProduct.wishlisted = Boolean(
            dictionary[item.rankProduct?.id],
          );
        }
      }
    }
  }
}
