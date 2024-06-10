import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  FEED_ACTIVITY_TYPE,
  FeedActivity,
  Follower,
  Rating,
} from '../entities';
import { BaseRepository } from './base.repository';
import { ListFeedActivitiesDTO } from 'src/domain';
import { BaseFilter } from 'src/library';

@Injectable()
export class FeedActivityRepository extends BaseRepository<FeedActivity> {
  constructor(private _dataSource: DataSource) {
    super(FeedActivity, _dataSource);
  }

  public async list(dto: ListFeedActivitiesDTO) {
    const { isOnlyFriend, userId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('feed'),
    )
      .leftJoinAndSelect('feed.createdBy', 'createdBy')
      .leftJoinAndMapOne(
        'feed.rating',
        Rating,
        'rating',
        `feed.referenceId = rating.id AND feed.type = '${FEED_ACTIVITY_TYPE.RATING}'`,
      );

    if (isOnlyFriend && userId) {
      query.innerJoin(
        Follower,
        'follower',
        `follower.follower = ${userId} AND follower.user = feed.createdBy`,
      );
    }
    return query.getManyAndCount();
  }
}
