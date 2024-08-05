import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { mapNumber } from 'src/utils';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity, BaseStatus } from './base.entity';
import { Brand } from './brand.entity';
import { Product } from './product.entity';
import { Feed } from './feed.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Entity(DATABASE_CONSTANT.TABLE_NAME.USER)
export class User extends BaseEntity {
  @Column({ nullable: true })
  @Index('IDX_Users_username')
  @Index('IDX_Users_lower_username', ['LOWER(username)'])
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  @Index('IDX_Users_email')
  @Index('IDX_Users_lower_email', ['LOWER(email)'])
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: BaseStatus.Active })
  status: BaseStatus;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Product, (product) => product.createdBy)
  products: Product[];

  statistics?: UserStatistics;

  feeds?: Feed[];

  isFollowed?: boolean;

  constructor(data?: Partial<User>) {
    super(data);
    this.username = data?.username;
    this.email = data?.email;
    this.deletedAt = data?.deletedAt;
    this.status = data?.status;
    this.isVerified = data?.isVerified;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.avatar = data?.avatar;
    this.products = data?.products;
    this.feeds = data?.feeds;
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
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      products: this?.products,
      feeds: this?.feeds,
    };
  }

  static getUsernameByEmail(email: string) {
    const splicedEmail = email.split('@')[0];
    return `${splicedEmail || ''}`;
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
