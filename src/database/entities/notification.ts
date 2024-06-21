import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { Entity, BaseEntity, Column } from 'typeorm';
import { User } from './user.entity';

export enum FEED_TYPE {
  RANK_PRODUCT = 'rank_product',
  QUESTION = 'question',
  REQUEST = 'request',
}

@Entity(DATABASE_CONSTANT.TABLE_NAME.NOTIFICATION)
export class Notification extends BaseEntity {
  @Column()
  type: string;

  @Column({ nullable: true })
  sender: User;

  constructor(data?: Partial<Notification>) {
    super(data);
    this.type = data?.type;
    this.sender = data?.sender;
  }
}
