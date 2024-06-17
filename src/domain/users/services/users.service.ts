import { HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_CODE_CONSTANT } from 'src/constants';
import {
  FollowerRepository,
  RankProductRepository,
  User,
  UserRepository,
  UserStatistics,
} from 'src/database';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class UsersService {
  constructor(
    private _userRepository: UserRepository,
    private _followRepository: FollowerRepository,
    private _rankProductRepository: RankProductRepository,
  ) {}

  public async mapUserStatistics(user: User) {
    const [totalFollowers, totalFollowing, totalRatings] = await Promise.all([
      this._followRepository.getTotalFollowersById(user.id),
      this._followRepository.getTotalFollowingById(user.id),
      this._rankProductRepository.totalRatingsByUser(user.id),
    ]);
    user.statistics = new UserStatistics({
      followerCount: totalFollowers,
      followingCount: totalFollowing,
      rankedProductCount: totalRatings,
    });
    return user;
  }

  public async getUserById(id: number) {
    const user = await this._userRepository.findOneBy({ id });
    if (!user) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.NOT_FOUND,
          message: `User id ${id} not found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
