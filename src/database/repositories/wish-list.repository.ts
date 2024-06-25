import { Injectable } from '@nestjs/common';
import { WishListDTO, WishListProductDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { WishList } from '../entities';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class WishListRepository extends BaseRepository<WishList> {
  constructor(_dataSource: DataSource) {
    super(WishList, _dataSource);
  }

  public async userList(userId: number, dto: WishListDTO) {
    const { categoryId, name, collectionId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('wishlist').where('wishlist.user=:userId', {
        userId,
      }),
    )
      .leftJoinAndSelect('wishlist.rankProduct', 'rankProduct')
      .leftJoin('wishlist.user', 'user')
      .leftJoinAndSelect('rankProduct.category', 'category')
      .leftJoinAndSelect('rankProduct.brand', 'brand');

    if (categoryId) {
      query.andWhere('rankProduct.categoryId=:categoryId', { categoryId });
    }

    if (name) {
      query.andWhere('rankProduct.name LIKE :name', { name: `%${name}%` });
    }

    return query
      .addSelect(UserRepository.getMainSelect('user'))
      .orderBy('wishlist.id', 'DESC')
      .getManyAndCount();
  }

  public async wishListProducts(dto: WishListProductDTO) {
    const queryBuilder = this._buildQuery(
      new BaseFilter(dto),
      this.createQueryBuilder('wishlist')
        .leftJoinAndSelect('wishlist.rankProduct', 'rankProduct')
        .leftJoinAndSelect('rankProduct.category', 'category')
        .leftJoinAndSelect('rankProduct.brand', 'brand')
        .leftJoin('wishlist.user', 'user'),
    );

    return queryBuilder
      .addSelect(UserRepository.getMainSelect('user'))
      .orderBy('wishlist.id', 'DESC')
      .getManyAndCount();
  }
}
