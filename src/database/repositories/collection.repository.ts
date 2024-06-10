import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Collection } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class CollectionRepository extends BaseRepository<Collection> {
  constructor(private _dataSource: DataSource) {
    super(Collection, _dataSource);
  }

  public async userList(userId: number) {
    return this.createQueryBuilder('collection')
      .where('collection.createdBy =:userId', { userId })
      .leftJoin('collection.collectionFeeds', 'collectionFeed')
      .loadRelationCountAndMap(
        'collection.totalItems',
        'collection.collectionFeeds',
      )
      .getMany();
  }
}
