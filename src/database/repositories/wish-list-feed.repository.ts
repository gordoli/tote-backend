import { Injectable } from '@nestjs/common';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { WishListFeed, FEED_TYPE, RankProduct } from '../entities';
import { BaseRepository } from './base.repository';
import { WishListDTO, WishListProductDTO } from 'src/domain';
import { UserRepository } from './user.repository';

@Injectable()
export class WishListFeedRepository extends BaseRepository<WishListFeed> {
  constructor(_dataSource: DataSource) {
    super(WishListFeed, _dataSource);
  }

  public async userList(userId: number, dto: WishListDTO) {
    const { categoryId, name, collectionId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('wishListFeed').where(
        'wishListFeed.createdBy=:userId',
        { userId },
      ),
    )
      .leftJoinAndSelect('wishListFeed.feed', 'feed')
      .leftJoinAndSelect('feed.createdBy', 'createdBy')
      .leftJoinAndMapOne(
        'feed.rankProduct',
        RankProduct,
        'rankProduct',
        `feed.referenceId = rankProduct.id AND (feed.type = '${FEED_TYPE.RANK_PRODUCT}')`,
      )
      .leftJoinAndSelect('rankProduct.category', 'category')
      .leftJoinAndSelect('rankProduct.brand', 'brand');
    if (categoryId) {
      query.andWhere('rankProduct.categoryId=:categoryId', { categoryId });
    }

    if (collectionId) {
      query.andWhere('wishListFeed.collection=:collectionId', {
        collectionId,
      });
    }

    if (name) {
      query.andWhere('rankProduct.name LIKE :name', { name: `%${name}%` });
    }
    return query
      .select([
        'wishListFeed',
        'rankProduct',
        'feed',
        'createdBy.id',
        'createdBy.username',
        'createdBy.email',
        'createdBy.avatar',
        'category',
        'brand',
      ])
      .orderBy('wishListFeed.id', 'DESC')
      .getManyAndCount();
  }

  public async wishListProducts(dto: WishListProductDTO) {
    const queryBuilder = this._buildQuery(
      new BaseFilter(dto),
      this.createQueryBuilder('wishListFeed')
        .leftJoinAndMapOne(
          'wishListFeed.rankProduct',
          RankProduct,
          'rankProduct',
          'wishListFeed.referenceId = rankProduct.id',
        )
        .leftJoinAndSelect('rankProduct.category', 'category')
        .leftJoinAndSelect('rankProduct.brand', 'brand')
        .leftJoin('wishListFeed.createdBy', 'createdBy')
        .where('wishListFeed.feedType = :productType', {
          productType: FEED_TYPE.DIRECT_RANK_PRODUCT,
        }),
    );

    return queryBuilder
      .addSelect(UserRepository.getMainSelect('createdBy'))
      .orderBy('wishListFeed.id', 'DESC')
      .getManyAndCount();
  }
}
