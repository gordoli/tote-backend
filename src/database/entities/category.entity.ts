import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DATABASE_CONSTANT } from 'src/constants/database.constants';

@Entity(DATABASE_CONSTANT.TABLE_NAME.CATEGORY)
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;
  constructor(data?: Partial<Category>) {
    super(data);
    this.name = data?.name;
    this.description = data?.description;
    this.image = data?.image;
  }
}
