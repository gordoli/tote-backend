import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { fixedNumber, mapNumber } from 'src/utils';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity, ColumnNumericTransformer } from './base.entity';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity(DATABASE_CONSTANT.TABLE_NAME.RANK_PRODUCT)
export class RankProduct extends BaseEntity {
  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    default: 10,
  })
  rate: number;

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

  wishlisted?: boolean;

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
    return mapNumber(fixedNumber(avg));
  }
}
