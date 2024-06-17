import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { mapNumber } from 'src/utils';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

export enum RANK_PRODUCT_RATE {
  BAD = 1,
  NORMAL = 2,
  GOOD = 3,
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.RANK_PRODUCT)
export class RankProduct extends BaseEntity {
  @Column({ type: 'smallint' })
  rate: RANK_PRODUCT_RATE;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Brand, (brand) => brand.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  constructor(data?: Partial<RankProduct>) {
    super(data);
    this.rate = data?.rate;
    this.link = data?.link;
    this.image = data?.image;
    this.name = data?.name;
    this.description = data?.description;
    this.brand = data?.brand;
    this.category = data?.category;
    this.createdBy = data?.createdBy;
  }

  public static getOverallRanking(avg = 0) {
    const avgRanking = (10 * avg) / RANK_PRODUCT_RATE.GOOD;
    return mapNumber(avgRanking.toFixed(2));
  }
}
