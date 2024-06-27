import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { ERROR_CODE_CONSTANT, MESSAGE_CONSTANT } from 'src/constants';
import {
  FollowerRepository,
  RankProductRepository,
  User,
  UserRepository,
  UserStatistics,
} from 'src/database';
import { HttpExceptionFilter } from 'src/library';
import { asyncForEach } from 'src/utils';
import { EditUserDto, SearchMembersDto } from '../dto';

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
    const serializedUser = new User(user.serialize());
    await this.mapUserStatistics(serializedUser);
    return serializedUser;
  }

  public async userFullInformation(id: number) {
    const user = await this._userRepository.userFullInformation(id);
    if (!user) {
      HttpExceptionFilter.throwError(
        {
          code: ERROR_CODE_CONSTANT.USER.NOT_FOUND,
          message: `User id ${id} not found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const serializedUser = new User(user.serialize());
    await this.mapUserStatistics(serializedUser);
    return serializedUser;
  }

  public async searchMembers(dto: SearchMembersDto) {
    const [items, total] = await this._userRepository.searchMembers(dto);
    await asyncForEach(items, async (item) => this.mapUserStatistics(item));
    return {
      items,
      total,
    };
  }

  public async editUser(user: User, dto: EditUserDto) {
    await this.validateUpdateUser(user, dto);
    await this._userRepository.update({ id: user.id }, dto);
    return this.getUserById(user.id);
  }

  public async validateUpdateUser(user: User, dto: EditUserDto) {
    const validations = Object.keys(dto)
      .filter((key) => dto[key])
      .map((key) => this.validateField(user, key, dto[key]));

    await Promise.all(validations);
  }

  private async validateField(user: User, key: string, value: string) {
    switch (key) {
      case 'email':
        await this._validateEmail(user, value);
        break;
      case 'username':
        await this._validateUsername(user, value);
        break;
      default:
        break;
    }
  }

  private async _validateEmail(user: User, email: string) {
    const foundEmail = await this._userRepository.findByLowerEmail(email);
    if (this._isConflict(foundEmail, user.id)) {
      throw new ConflictException(MESSAGE_CONSTANT.USER.CONFLICT_EMAIL);
    }
  }

  private async _validateUsername(user: User, username: string) {
    const foundUsername = await this._userRepository.findByLowerUsername(
      username,
    );
    if (this._isConflict(foundUsername, user.id)) {
      throw new ConflictException(MESSAGE_CONSTANT.USER.CONFLICT_USERNAME);
    }
  }

  private _isConflict(user: User, id: number) {
    return user && !user.deletedAt && user.id !== id;
  }
}
