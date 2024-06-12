import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Collection } from './collection.entity';
import { FEED_ACTIVITY_TYPE, FeedActivity } from './feed-activity.entity';
import { Rating } from './rating.entity';
import { User } from './user.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.COLLECTION_FEED)
@Index('idx_collection_feeds_feed_collection', ['feed.id', 'collection.id'], {
  unique: true,
})
export class CollectionFeed extends BaseEntity {
  @Column()
  feedType: FEED_ACTIVITY_TYPE;

  @Column()
  @Index('idx_collection_feeds_referenceId')
  referenceId: number;

  rating?: Rating;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ManyToOne(() => Collection, (collection) => collection.id)
  collection: Collection;

  @ManyToOne(() => FeedActivity, (feed) => feed.id)
  feed: FeedActivity;

  constructor(data?: Partial<CollectionFeed>) {
    super(data);
    this.feedType = data?.feedType;
    this.referenceId = data?.referenceId;
    this.createdBy = data?.createdBy;
    this.collection = data?.collection;
    this.feed = data?.feed;
  }
}
