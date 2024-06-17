import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WishList } from './wish-list.entity';
import { FEED_TYPE, Feed } from './feed-activity.entity';
import { RankProduct } from './rank-product.entity';
import { User } from './user.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.WISHLIST_FEED)
@Index('idx_wish_list_feeds_feed_wish_list', ['feed.id', 'wishList.id'], {
  unique: true,
})
export class WishListFeed extends BaseEntity {
  @Column()
  feedType: FEED_TYPE;

  @Column()
  @Index('idx_wish_list_feeds_referenceId')
  referenceId: number;

  rankProduct?: RankProduct;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ManyToOne(() => WishList, (wishList) => wishList.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishList: WishList;

  @ManyToOne(() => Feed, (feed) => feed.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: Feed;

  constructor(data?: Partial<WishListFeed>) {
    super(data);
    this.feedType = data?.feedType;
    this.referenceId = data?.referenceId;
    this.createdBy = data?.createdBy;
    this.wishList = data?.wishList;
    this.feed = data?.feed;
  }
}
