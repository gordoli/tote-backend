import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { WishListFeed } from './wish-list-feed.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.WISHLIST)
export class WishList extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(() => WishListFeed, (wishListFeed) => wishListFeed.wishList)
  wishListFeeds: WishListFeed[];

  totalItems?: number;

  constructor(data?: Partial<WishList>) {
    super(data);
    this.name = data?.name;
    this.createdBy = data?.createdBy;
  }
}
