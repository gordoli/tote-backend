import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { CollectionFeed } from './collection-feed.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.COLLECTION)
export class Collection extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @OneToMany(
    () => CollectionFeed,
    (collectionFeed) => collectionFeed.collection,
  )
  collectionFeeds: CollectionFeed[];

  totalItems?: number;

  constructor(data?: Partial<Collection>) {
    super(data);
    this.name = data?.name;
    this.createdBy = data?.createdBy;
  }
}
