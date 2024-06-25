import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RankProduct } from './rank-product.entity';
import { User } from './user.entity';

@Entity(DATABASE_CONSTANT.TABLE_NAME.WISHLIST)
export class WishList extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => RankProduct, (product) => product.id)
  product: RankProduct;

  constructor(data?: Partial<WishList>) {
    super(data);
    this.user = data?.user;
    this.product = data?.product;
  }
}
