import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity(DATABASE_CONSTANT.TABLE_NAME.CUSTOM_LIST)
export class CustomList extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  totalItems?: number;

  constructor(data?: Partial<CustomList>) {
    super(data);
    this.name = data?.name;
    this.user = data?.user;
  }
}
