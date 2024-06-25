import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { RankProduct } from './rank-product.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

export enum FEED_TYPE {
  RANK_PRODUCT = 'rank_product',
  QUESTION = 'question',
  REQUEST = 'request',
  DIRECT_RANK_PRODUCT = 'direct_rank_product',
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.FEED)
export class Feed extends BaseEntity {
  @Column()
  type: FEED_TYPE;

  @Column()
  @Index('idx_feeds_referenceId')
  referenceId: number;

  rankProduct?: RankProduct;

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
