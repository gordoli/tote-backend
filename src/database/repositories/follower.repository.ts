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

  public async getTotalFollowersById(id: string) {
    const totalFollowers = await this.createQueryBuilder('followers')
      .where('followers.user =:id', { id })
      .select('COUNT(followers.id)')
      .getRawOne<{ count: number }>();
    return mapNumber(totalFollowers?.count);
  }

  public async getTotalFollowingById(id: string) {
    const totalFollowing = await this.createQueryBuilder('followers')
      .where('followers.follower =:id', { id })
      .select('COUNT(followers.id)')
      .getRawOne<{ count: number }>();
    return mapNumber(totalFollowing?.count);
  }

  public async followingByUserId(userId: string, filter: BaseFilter) {
    return this._buildQuery(
      new BaseFilter(filter),
      this.createQueryBuilder('follows'),
    )
      .leftJoinAndSelect('follows.user', 'user')
      .where('follows.follower =:userId', { userId })
      .orderBy('follows.id', 'DESC')
      .getManyAndCount();
  }

  public async followersByUserId(userId: string, filter: BaseFilter) {
    return this._buildQuery(
      new BaseFilter(filter),
      this.createQueryBuilder('follows'),
    )
      .leftJoinAndSelect('follows.follower', 'follower')
      .where('follows.user =:userId', { userId })
      .orderBy('follows.id', 'DESC')
      .getManyAndCount();
  }

  public unFollowUser(userId: string, followerId: string) {
    return this.delete({
      user: { id: userId },
      follower: { id: followerId },
    });
  }

  public followUser(userId: string, followerId: string) {
    return this.upsert(
      {
        user: { id: userId },
        follower: { id: followerId },
      },
      ['user', 'follower'],
    );
  }

  public async isFollowed(userId: string, followerId: string) {
    return this.existsBy({
      user: { id: userId },
      follower: { id: followerId },
    });
  }
}
