import { Injectable } from '@nestjs/common';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { Follower } from '../entities';
import { BaseRepository } from './base.repository';
import { mapNumber } from 'src/utils';

@Injectable()
export class FollowerRepository extends BaseRepository<Follower> {
  constructor(_dataSource: DataSource) {
    super(Follower, _dataSource);
  }

  public async getTotalFollowersById(id: number) {
    const totalFollowers = await this.createQueryBuilder('followers')
      .where('followers.user =:id', { id })
      .select('COUNT(followers.id)')
      .getRawOne<{ count: number }>();
    return mapNumber(totalFollowers?.count);
  }

  public async getTotalFollowingById(id: number) {
    const totalFollowing = await this.createQueryBuilder('followers')
      .where('followers.follower =:id', { id })
      .select('COUNT(followers.id)')
      .getRawOne<{ count: number }>();
    return mapNumber(totalFollowing?.count);
  }

  public async followingByUserId(userId: number, filter: BaseFilter) {
    return this._buildQuery(
      new BaseFilter(filter),
      this.createQueryBuilder('follows'),
    )
      .leftJoinAndSelect('follows.user', 'user')
      .where('follows.follower =:userId', { userId })
      .orderBy('follows.id', 'DESC')
      .getManyAndCount();
  }

  public async followersByUserId(userId: number, filter: BaseFilter) {
    return this._buildQuery(
      new BaseFilter(filter),
      this.createQueryBuilder('follows'),
    )
      .leftJoinAndSelect('follows.follower', 'follower')
      .where('follows.user =:userId', { userId })
      .orderBy('follows.id', 'DESC')
      .getManyAndCount();
  }

  public unFollowUser(userId: number, followerId: number) {
    return this.delete({
      user: { id: userId },
      follower: { id: followerId },
    });
  }

  public followUser(userId: number, followerId: number) {
    return this.upsert(
      {
        user: { id: userId },
        follower: { id: followerId },
      },
      ['user', 'follower'],
    );
  }

  public async isFollowed(userId: number, followerId: number) {
    return this.existsBy({
      user: { id: userId },
      follower: { id: followerId },
    });
  }
}
