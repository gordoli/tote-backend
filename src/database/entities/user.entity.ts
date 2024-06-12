import { SocialData } from 'src/domain/auth/types';
import { Column, Entity } from 'typeorm';
import { BaseEntity, BaseStatus } from './base.entity';
import { Exclude } from 'class-transformer';
import { mapNumber } from 'src/utils';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

export enum UserProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.USER)
export class User extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: BaseStatus.Active })
  status: BaseStatus;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: UserProvider.EMAIL })
  provider: UserProvider;

  @Column({ nullable: true })
  socialId: string;

  statistics?: UserStatistics;

  constructor(data?: Partial<User>) {
    super(data);
    this.username = data?.username;
    this.email = data?.email;
    this.password = data?.password;
    this.refreshToken = data?.refreshToken;
    this.deletedAt = data?.deletedAt;
    this.status = data?.status;
    this.isVerified = data?.isVerified;
    this.provider = data?.provider;
    this.socialId = data?.socialId;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.avatar = data?.avatar;
  }

  public serialize() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      deletedAt: this.deletedAt,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
      provider: this.provider,
      socialId: this.socialId,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
    };
  }

  static mapSocialProfile(socialData: SocialData, provider: UserProvider) {
    const { id, email, firstName, lastName } = socialData;
    return new User({
      provider,
      socialId: id,
      username: User.getUsernameByEmail(email),
      email,
      firstName,
      lastName,
    });
  }

  static getUsernameByEmail(email: string) {
    return email.split('@')[0];
  }

  public mainInfo() {
    return new User({
      id: this.id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
    });
  }
}

export class UserStatistics {
  followingCount: number;
  followerCount: number;
  rankedProductCount: number;
  constructor(data: Partial<UserStatistics> = {}) {
    this.followerCount = mapNumber(data?.followerCount);
    this.followingCount = mapNumber(data?.followingCount);
    this.rankedProductCount = mapNumber(data?.rankedProductCount);
  }
}
