import { Injectable } from '@nestjs/common';
import { ListFeedsDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { FEED_TYPE, Feed, RankProduct } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class FeedRepository extends BaseRepository<Feed> {
  constructor(_dataSource: DataSource) {
    super(Feed, _dataSource);
  }

  public async list(dto: ListFeedsDTO) {
    const { isOnlyFriend, userId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('feed'),
    )
      .leftJoinAndSelect('feed.createdBy', 'createdBy')
      .leftJoinAndMapOne(
        'feed.rankProduct',
        RankProduct,
        'rankProduct',
        `feed.referenceId = rankProduct.id AND feed.type = '${FEED_TYPE.RANK_PRODUCT}'`,
      );

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'feed.createdBy', userId);
    }
    return query.orderBy('feed.id', 'DESC').getManyAndCount();
  }
}