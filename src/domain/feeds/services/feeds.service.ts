import { Injectable } from '@nestjs/common';
import {
  FEED_TYPE,
  Feed,
  FeedRepository,
  RankProduct,
  User,
} from 'src/database';
import { ListFeedsDTO } from '../dto';

@Injectable()
export class FeedsService {
  constructor(private _feedRepository: FeedRepository) {}

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
    items.forEach((item) => {
      item.createdBy = new User(item.createdBy).mainInfo();
      if (item.rankProduct) {
        item.rankProduct.createdBy = item.createdBy;
      }
    });
    return { items, total };
  }
}
