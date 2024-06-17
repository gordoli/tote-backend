import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { mapNumber } from 'src/utils';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.BRAND)
export class Brand extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
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

  overallRanking?: number;

  rankProducts?: BrandRanking;

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

export class BrandRanking {
  userRating: number;
  friendsRating: number;
  overallRanking: number;
  totalRanking: number;
  constructor(data: Partial<BrandRanking> = {}) {
    this.userRating = mapNumber(data?.userRating);
    this.friendsRating = mapNumber(data?.friendsRating);
    this.overallRanking = mapNumber(data?.overallRanking);
    this.totalRanking = mapNumber(data?.totalRanking);
  }
}
