import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Wishlist } from './wishlist.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export enum FEED_TYPE {
  RANK_PRODUCT = 'rank_product',
  WISHLIST = 'wishlist',
}

@ApiTags('Feed')
@Entity(DATABASE_CONSTANT.TABLE_NAME.FEED)
export class Feed extends BaseEntity {
  @Column()
  type: FEED_TYPE;

  @ApiProperty({
    description: 'Points to a Product if this feed post is for a product.',
  })
  @OneToMany(() => Product, (product) => product.id, {
    cascade: true,
  })
  product?: Product;

  @ApiProperty({
    description: 'Points to a Wishlist if this feed post is for a wishlist.',
  })
  @OneToMany(() => Wishlist, (wishlist) => wishlist.id, {
    cascade: true,
  })
  wishlist?: Wishlist;

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
    this.title = data?.title;
    this.createdBy = data?.createdBy;
  }
}
