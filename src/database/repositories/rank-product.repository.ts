import { Injectable } from '@nestjs/common';
import { ListRankProductDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { mapNumber } from 'src/utils';
import { DataSource, In, SelectQueryBuilder } from 'typeorm';
import { RankProduct } from '../entities';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class RankProductRepository extends BaseRepository<RankProduct> {
  constructor(_dataSource: DataSource) {
    super(RankProduct, _dataSource);
  }

  public async list(dto: ListRankProductDTO) {
    const { name, isOnlyFriend, userId, brandId, categoryId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('rankProduct'),
    )
      .leftJoinAndSelect('rankProduct.brand', 'brand')
      .leftJoinAndSelect('rankProduct.category', 'category')
      .leftJoin('rankProduct.createdBy', 'createdBy');

    if (name) {
      query.andWhere('rankProduct.name LIKE :name', { name: `%${name}%` });
    }

    if (brandId) {
      query.andWhere('rankProduct.brandId =:brandId', { brandId });
    }

    if (categoryId) {
      query.andWhere('category.id =:categoryId', { categoryId });
    }

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'rankProduct.createdBy', userId);
    }
    return query
      .addSelect(UserRepository.getMainSelect('createdBy'))
      .orderBy('rankProduct.id', 'DESC')
      .getManyAndCount();
  }
  public async listByUser(dto: ListRankProductDTO) {
    const { name, isOnlyFriend, userId, brandId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('rankProduct'),
    )
      .leftJoinAndSelect('rankProduct.brand', 'brand')
      .leftJoinAndSelect('rankProduct.category', 'category');

    if (name) {
      query.andWhere('rankProduct.name LIKE :name', { name: `%${name}%` });
    }

    if (brandId) {
      query.andWhere('rankProduct.brandId =:brandId', { brandId });
    }

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'rankProduct.createdBy', userId);
    }
    return query.orderBy('rankProduct.id', 'DESC').getManyAndCount();
  }

  public async overallRatingBrands(brandIds: string[]) {
    if (brandIds.length) {
      const query = this.createQueryBuilder('rankProduct').where(
        'rankProduct.brand IN (:...brandIds)',
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
    const query = this.createQueryBuilder('rankProduct')
      .where('rankProduct.brand =:brandId', { brandId })
      .andWhere('rankProduct.createdBy =:userId', { userId });

    this._selectAvgRating(query);

    const rankProduct = await query.getRawOne<{
      avg: number;
      brandId: string;
    }>();
    return mapNumber(rankProduct?.avg);
  }

  public async overallFriendsRatingBrandByUser(
    brandId: string,
    userId: string,
  ) {
    const query = this.createQueryBuilder('rankProduct').where(
      'rankProduct.brand =:brandId',
      { brandId },
    );

    this._selectAvgRating(query);

    this._friendOnly(query, 'rankProduct.createdBy', userId);

    const rankProduct = await query.getRawOne<{
      avg: number;
      brandId: string;
    }>();

    return mapNumber(rankProduct?.avg);
  }

  public async totalRatingsByUser(userId: string) {
    return this.countBy({ createdBy: { id: userId } });
  }

  public async findByIds(ids: string[]) {
    if (ids.length) {
      return this.find({
        where: { id: In(ids) },
        relations: {
          createdBy: true,
          brand: true,
          category: true,
        },
      });
    }
    return [];
  }

  private _selectAvgRating(queryBuilder: SelectQueryBuilder<RankProduct>) {
    queryBuilder
      .select('AVG(rankProduct.rate) as avg')
      .addSelect('rankProduct.brand')
      .groupBy('rankProduct.brand');
  }
}
