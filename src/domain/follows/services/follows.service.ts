import { Injectable } from '@nestjs/common';
import { FollowerRepository, User } from 'src/database';
import { BaseFilter } from 'src/library';

@Injectable()
export class FollowsService {
  constructor(private _followRepository: FollowerRepository) {}

  public async userFollowers(userId: string, filter: BaseFilter) {
    const [items, total] = await this._followRepository.followersByUserId(
      userId,
      filter,
    );
    return {
      items: items.map((el) => new User(el.follower).mainInfo()),
      total,
    };
  }

  public async userFollowing(userId: string, filter: BaseFilter) {
    const [items, total] = await this._followRepository.followingByUserId(
      userId,
      filter,
    );
    return {
      items: items.map((el) => new User(el.user).mainInfo()),
      total,
    };
  }

  public async followUser(user: User, userId: string) {
    return this._followRepository.followUser(userId, user.id);
  }

  public async unFollowUser(user: User, userId: string) {
    return this._followRepository.unFollowUser(userId, user.id);
  }
}
