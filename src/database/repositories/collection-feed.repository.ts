import { Injectable } from '@nestjs/common';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { CollectionFeed, FEED_ACTIVITY_TYPE, Rating } from '../entities';
import { BaseRepository } from './base.repository';
import { WishListDTO } from 'src/domain';

@Injectable()
export class CollectionFeedRepository extends BaseRepository<CollectionFeed> {
  constructor(private _dataSource: DataSource) {
    super(CollectionFeed, _dataSource);
  }

  public async userList(userId: number, dto: WishListDTO) {
    const { categoryId, name, collectionId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('collectionFeed').where(
        'collectionFeed.createdBy=:userId',
        { userId },
      ),
    )
      .leftJoinAndSelect('collectionFeed.feed', 'feed')
      .leftJoinAndSelect('feed.createdBy', 'createdBy')
      .leftJoinAndMapOne(
        'feed.rating',
        Rating,
        'rating',
        `feed.referenceId = rating.id AND feed.type = '${FEED_ACTIVITY_TYPE.RATING}'`,
      )
      .leftJoinAndSelect('rating.category', 'category')
      .leftJoinAndSelect('rating.brand', 'brand');
    if (categoryId) {
      query.andWhere('rating.categoryId=:categoryId', { categoryId });
    }

    if (collectionId) {
      query.andWhere('collectionFeed.collection=:collectionId', {
        collectionId,
      });
    }

    if (name) {
      query.andWhere('rating.name LIKE :name', { name: `%${name}%` });
    }
    return query
      .select([
        'collectionFeed',
        'rating',
        'feed',
        'createdBy.id',
        'createdBy.username',
        'createdBy.email',
        'createdBy.avatar',
        'category',
        'brand',
      ])
      .getManyAndCount();
  }
}
