import { DATABASE_CONSTANT } from 'src/constants/database.constants';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

export enum NotificationType {
  FOLLOW = 'follow',
}

@ApiTags('Notification')
@Entity({ name: DATABASE_CONSTANT.TABLE_NAME.NOTIFICATION })
export class Notification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  sender: User;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  receiver: User;

  @Column({ nullable: true })
  receiverId: string;

  @Column()
  type: NotificationType;

  @Column({ type: 'jsonb', nullable: true })
  data: object;

  @Column({ default: false })
  readStatus: boolean;

  constructor(data?: Partial<Notification>) {
    super();
    this.id = data?.id;
    this.sender = data?.sender;
    this.senderId = data?.senderId;
    this.receiver = data?.receiver;
    this.receiverId = data?.receiverId;
    this.type = data?.type;
    this.data = data?.data;
    this.readStatus = data?.readStatus;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
  }
}
