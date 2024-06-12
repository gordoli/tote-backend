import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Rating } from './rating.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

export enum FEED_ACTIVITY_TYPE {
  RATING = 'rating',
  QUESTION = 'question',
  REQUEST = 'request',
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.FEED_ACTIVITY)
export class FeedActivity extends BaseEntity {
  @Column()
  type: FEED_ACTIVITY_TYPE;

  @Column()
  @Index('idx_feed_activities_referenceId')
  referenceId: number;

  rating?: Rating;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  constructor(data?: Partial<FeedActivity>) {
    super(data);
    this.type = data?.type;
    this.referenceId = data?.referenceId;
    this.title = data?.title;
    this.createdBy = data?.createdBy;
  }
}
