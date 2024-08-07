import { Injectable } from '@nestjs/common';
import { ListFeedsDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { FEED_TYPE, Feed, RankProduct } from '../entities';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

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
    ).leftJoin('feed.createdBy', 'createdBy');
    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'feed.createdBy', userId);
      // Return only feeds created by friends of the user AND ALSO THE USER THEMSELF
    }
    const userSelects = UserRepository.getMainSelect('createdBy');
    console.log(query.toString());
    return query
      .orderBy('feed.id', 'DESC')
      .addSelect(userSelects)
      .getManyAndCount();
  }

  public async findByUserId(userId: number) {
    return this.createQueryBuilder('feed')
      .leftJoinAndMapOne(
        'feed.rankProduct',
        RankProduct,
        'rankProduct',
        `feed.referenceId = rankProduct.id AND feed.type = '${FEED_TYPE.RANK_PRODUCT}'`,
      )
      .leftJoinAndSelect('rankProduct.category', 'category')
      .leftJoinAndSelect('rankProduct.brand', 'brand')
      .where('feed.createdBy =:userId', { userId })
      .orderBy('feed.id', 'DESC')
      .getMany();
  }
}
