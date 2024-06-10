import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Follower, Rating } from '../entities';
import { BaseRepository } from './base.repository';
import { ListRatingDTO } from 'src/domain';
import { BaseFilter } from 'src/library';
import { mapNumber } from 'src/utils';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(private _dataSource: DataSource) {
    super(Rating, _dataSource);
  }

  public async list(dto: ListRatingDTO) {
    const { name, isOnlyFriend, userId, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('rating'),
    )
      .leftJoinAndSelect('rating.brand', 'brand')
      .leftJoinAndSelect('rating.category', 'category')
      .leftJoinAndSelect('rating.createdBy', 'createdBy');
    if (name) {
      query.andWhere('rating.name LIKE :name', { name: `%${name}%` });
    }

    if (isOnlyFriend && userId) {
      query.innerJoin(
        Follower,
        'follower',
        `follower.follower = ${userId} AND follower.user = rating.createdBy`,
      );
    }
    return query.getManyAndCount();
  }

  public async overallRatingBrands(brandIds: number[]) {
    if (brandIds.length) {
      const data = await this.createQueryBuilder('rating')
        .where('rating.brand IN (:...brandIds)', { brandIds })
        .select('AVG(rating.rate) as avg')
        .addSelect('rating.brand')
        .groupBy('rating.brand')
        .getRawMany<{ avg: number; brandId: number }>();
      return data.map(({ avg = 0, brandId }) => ({
        avg: mapNumber(avg),
        brandId,
      }));
    }
    return [];
  }

  public async overallRatingBrand(brandId: number) {
    const overallRatings = await this.overallRatingBrands([brandId]);
    const overallRating = overallRatings.pop();
    return mapNumber(overallRating?.avg);
  }

  public async overallRatingBrandByUser(brandId: number, userId: number) {
    const rating = await this.createQueryBuilder('rating')
      .where('rating.brand =:brandId', { brandId })
      .andWhere('rating.createdBy =:userId', { userId })
      .select('AVG(rating.rate) as avg')
      .addSelect('rating.brand')
      .groupBy('rating.brand')
      .getRawOne<{ avg: number; brandId: number }>();
    return mapNumber(rating?.avg);
  }

  public async overallFriendsRatingBrandByUser(
    brandId: number,
    userId: number,
  ) {
    const rating = await this.createQueryBuilder('rating')
      .where('rating.brand =:brandId', { brandId })
      .andWhere('rating.createdBy =:userId', { userId })
      .innerJoin(
        Follower,
        'follower',
        `follower.follower = ${userId} AND follower.user = rating.createdBy`,
      )
      .select('AVG(rating.rate) as avg')
      .addSelect('rating.brand')
      .groupBy('rating.brand')
      .getRawOne<{ avg: number; brandId: number }>();
    return mapNumber(rating?.avg);
  }

  public async totalRatingsByUser(userId: number) {
    return this.countBy({ createdBy: { id: userId } });
  }
}
