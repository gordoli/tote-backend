import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WishList } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class WishListRepository extends BaseRepository<WishList> {
  constructor(private _dataSource: DataSource) {
    super(WishList, _dataSource);
  }

  public async userList(userId: number) {
    return this.createQueryBuilder('wishList')
      .where('wishList.createdBy =:userId', { userId })
      .leftJoin('wishList.wishListFeeds', 'wishListFeed')
      .loadRelationCountAndMap('wishList.totalItems', 'wishList.wishListFeeds')
      .getMany();
  }
}
