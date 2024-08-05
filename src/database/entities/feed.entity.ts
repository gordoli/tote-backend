import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { ApiTags } from '@nestjs/swagger';

export enum FEED_TYPE {
  RANK_PRODUCT = 'rank_product',
  WISHLIST = 'wishlist',
  QUESTION = 'question',
  REQUEST = 'request',
  DIRECT_RANK_PRODUCT = 'direct_rank_product',
}

@ApiTags('Feed')
@Entity(DATABASE_CONSTANT.TABLE_NAME.FEED)
export class Feed extends BaseEntity {
  @Column()
  type: FEED_TYPE;

  @Column()
  @Index('idx_feeds_referenceId')
  referenceId: string;

  rankProduct?: Product;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  constructor(data?: Partial<Feed>) {
    super(data);
    this.type = data?.type;
    this.referenceId = data?.referenceId;
    this.title = data?.title;
    this.createdBy = data?.createdBy;
  }
}
