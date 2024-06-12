import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { mapNumber } from 'src/utils';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

export enum RATING_RATE {
  BAD = 1,
  NORMAL = 2,
  GOOD = 3,
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.RATING)
export class Rating extends BaseEntity {
  @Column({ type: 'smallint' })
  rate: RATING_RATE;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  constructor(data?: Partial<Rating>) {
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

  public static getOverallRating(avg = 0) {
    const avgRating = avg / RATING_RATE.GOOD;
    return mapNumber(avgRating.toFixed(2));
  }
}
