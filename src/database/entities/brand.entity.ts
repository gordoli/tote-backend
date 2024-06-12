import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { mapNumber } from 'src/utils';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.BRAND)
export class Brand extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  cover: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  overallRating?: number;

  ratings?: BrandRatings;

  constructor(data?: Partial<Brand>) {
    super(data);
    this.user = data?.user;
    this.name = data?.name;
    this.description = data?.description;
    this.cover = data?.cover;
    this.logo = data?.logo;
    this.website = data?.website;
  }
}

export class BrandRatings {
  userRating: number;
  friendsRating: number;
  overallRating: number;
  totalProductsRated: number;
  constructor(data: Partial<BrandRatings> = {}) {
    this.userRating = mapNumber(data?.userRating);
    this.friendsRating = mapNumber(data?.friendsRating);
    this.overallRating = mapNumber(data?.overallRating);
    this.totalProductsRated = mapNumber(data?.totalProductsRated);
  }
}
