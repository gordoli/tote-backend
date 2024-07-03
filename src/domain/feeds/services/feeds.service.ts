import { Injectable } from '@nestjs/common';
import {
  FEED_TYPE,
  Feed,
  FeedRepository,
  RankProduct,
  User,
  WishListRepository,
} from 'src/database';
import { ListFeedsDTO } from '../dto';
import { keyBy } from 'lodash';
import { WishListService } from 'src/domain/wish-lists';

@Injectable()
export class FeedsService {
  constructor(
    private _feedRepository: FeedRepository,
    private _wishListService: WishListService,
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

  public async list(dto: ListFeedsDTO) {
    const [items, total] = await this._feedRepository.list(dto);
    return { items, total };
  }

  public async mapWishListed(items: Feed[], userId: number) {
    if (items.length) {
      const productIds = items.map((item) => item.rankProduct?.id);
      const dictionary = await this._wishListService.dictionaryUserProducts(
        productIds,
        userId,
      );

      for (const item of items) {
        if (item.rankProduct?.id) {
          item.rankProduct.wishlisted = Boolean(dictionary[item.id]);
        }
      }
    }
  }
}
