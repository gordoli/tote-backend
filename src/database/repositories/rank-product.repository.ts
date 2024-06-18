import { Injectable } from '@nestjs/common';
import { ListRankProductDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { mapNumber } from 'src/utils';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { RankProduct } from '../entities';
import { BaseRepository } from './base.repository';
import { UserRepository } from './user.repository';

@Injectable()
export class RankProductRepository extends BaseRepository<RankProduct> {
  constructor(private _dataSource: DataSource) {
    super(RankProduct, _dataSource);
  }

  public async list(dto: ListRankProductDTO) {
    const { name, isOnlyFriend, userId, brandId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('rankProduct'),
    )
      .leftJoinAndSelect('rankProduct.brand', 'brand')
      .leftJoinAndSelect('rankProduct.category', 'category')
      .leftJoinAndSelect('rankProduct.createdBy', 'createdBy');

    if (name) {
      query.andWhere('rankProduct.name LIKE :name', { name: `%${name}%` });
    }

    if (brandId) {
      query.andWhere('rankProduct.brandId =:brandId', { brandId });
    }

    if (isOnlyFriend && userId) {
      this._friendOnly(query, 'rankProduct.createdBy', userId);
    }
    return query
      .select(
        ['rankProduct', 'brand', 'category'].concat(
          UserRepository.getMainSelect('createdBy'),
        ),
      )
      .orderBy('rankProduct.id', 'DESC')
      .getManyAndCount();
  }

  public async overallRatingBrands(brandIds: number[]) {
    if (brandIds.length) {
      const query = this.createQueryBuilder('rankProduct').where(
        'rankProduct.brand IN (:...brandIds)',
        { brandIds },
      );

      this._selectAvgRating(query);

      const data = await query.getRawMany<{ avg: number; brandId: number }>();
      return data.map(({ avg = 0, brandId }) => ({
        avg: mapNumber(avg),
        brandId,
      }));
    }
    return [];
  }

  public async overallRatingBrand(brandId: number) {
    const overallRatings = await this.overallRatingBrands([brandId]);
    const overallRanking = overallRatings.pop();
    return mapNumber(overallRanking?.avg);
  }

  public async overallRatingBrandByUser(brandId: number, userId: number) {
    const query = this.createQueryBuilder('rankProduct')
      .where('rankProduct.brand =:brandId', { brandId })
      .andWhere('rankProduct.createdBy =:userId', { userId });

    this._selectAvgRating(query);

    const rankProduct = await query.getRawOne<{
      avg: number;
      brandId: number;
    }>();
    return mapNumber(rankProduct?.avg);
  }

  public async overallFriendsRatingBrandByUser(
    brandId: number,
    userId: number,
  ) {
    const query = this.createQueryBuilder('rankProduct').where(
      'rankProduct.brand =:brandId',
      { brandId },
    );

    this._selectAvgRating(query);

    this._friendOnly(query, 'rankProduct.createdBy', userId);

    const rankProduct = await query.getRawOne<{
      avg: number;
      brandId: number;
    }>();

    return mapNumber(rankProduct?.avg);
  }

  public async totalRatingsByUser(userId: number) {
    return this.countBy({ createdBy: { id: userId } });
  }

  private _selectAvgRating(queryBuilder: SelectQueryBuilder<RankProduct>) {
    queryBuilder
      .select('AVG(rankProduct.rate) as avg')
      .addSelect('rankProduct.brand')
      .groupBy('rankProduct.brand');
  }
}
