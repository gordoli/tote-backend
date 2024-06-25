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
      .leftJoinAndSelect('wishlist.product', 'product')
      .leftJoin('wishlist.user', 'user')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand');

    if (categoryId) {
      query.andWhere('product.categoryId=:categoryId', { categoryId });
    }

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
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
        .leftJoinAndSelect('wishlist.product', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoin('wishlist.user', 'user'),
    );

    return queryBuilder
      .addSelect(UserRepository.getMainSelect('user'))
      .orderBy('wishlist.id', 'DESC')
      .getManyAndCount();
  }

  public async wishLists(dto: WishListProductDTO) {
    const queryBuilder = this._buildQuery(
      new BaseFilter(dto),
      this.createQueryBuilder('wishlist')
        .leftJoinAndSelect('wishlist.product', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.brand', 'brand'),
    );

    return queryBuilder.orderBy('wishlist.id', 'DESC').getManyAndCount();
  }
}
