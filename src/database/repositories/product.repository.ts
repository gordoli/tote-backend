import { Injectable } from '@nestjs/common';
import { ListProductDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { mapNumber } from 'src/utils';
import { DataSource, In, SelectQueryBuilder } from 'typeorm';
import { Product } from '../entities';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(_dataSource: DataSource) {
    super(Product, _dataSource);
  }

  public async list(dto: ListProductDTO) {
    const { name, isOnlyFriend, userId, brandId, categoryId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('product'),
    )
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.createdBy', 'createdBy');

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    if (brandId) {
      query.andWhere('product.brandId =:brandId', { brandId });
    }

    if (categoryId) {
      query.andWhere('category.id =:categoryId', { categoryId });
    }

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'product.createdBy', userId);
    }
    return query
      .addSelect(UserRepository.getMainSelect('createdBy'))
      .orderBy('product.id', 'DESC')
      .getManyAndCount();
  }
  public async listByUser(dto: ListProductDTO) {
    const { name, isOnlyFriend, userId, brandId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('product'),
    )
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category');

    if (name) {
      query.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    if (brandId) {
      query.andWhere('product.brandId =:brandId', { brandId });
    }

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'product.createdBy', userId);
    }
    return query.orderBy('product.id', 'DESC').getManyAndCount();
  }

  public async overallRatingBrands(brandIds: string[]) {
    if (brandIds.length) {
      const query = this.createQueryBuilder('product').where(
        'product.brand IN (:...brandIds)',
        { brandIds },
      );

      this._selectAvgRating(query);

      const data = await query.getRawMany<{ avg: number; brandId: string }>();
      return data.map(({ avg = 0, brandId }) => ({
        avg: mapNumber(avg),
        brandId,
      }));
    }
    return [];
  }

  public async overallRatingBrand(brandId: string) {
    const overallRatings = await this.overallRatingBrands([brandId]);
    const overallRanking = overallRatings.pop();
    return mapNumber(overallRanking?.avg);
  }

  public async overallRatingBrandByUser(brandId: string, userId: string) {
    const query = this.createQueryBuilder('product')
      .where('product.brand =:brandId', { brandId })
      .andWhere('product.createdBy =:userId', { userId });

    this._selectAvgRating(query);

    const product = await query.getRawOne<{
      avg: number;
      brandId: string;
    }>();
    return mapNumber(product?.avg);
  }

  public async overallFriendsRatingBrandByUser(
    brandId: string,
    userId: string,
  ) {
    const query = this.createQueryBuilder('product').where(
      'product.brand =:brandId',
      { brandId },
    );

    this._selectAvgRating(query);

    this._friendOnly(query, 'product.createdBy', userId);

    const product = await query.getRawOne<{
      avg: number;
      brandId: string;
    }>();

    return mapNumber(product?.avg);
  }

  public async totalRatingsByUser(userId: string) {
    return this.countBy({ createdBy: { id: userId } });
  }

  public async findByIds(ids: string[]) {
    if (ids.length) {
      return this.find({
        where: { id: In(ids) },
        relations: {
          brand: true,
          category: true,
        },
      });
    }
    return [];
  }

  private _selectAvgRating(queryBuilder: SelectQueryBuilder<Product>) {
    queryBuilder
      .select('AVG(product.rate) as avg')
      .addSelect('product.brand')
      .groupBy('product.brand');
  }
}
