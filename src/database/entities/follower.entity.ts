import { Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('followers')
@Index('idx_followers_user_follower', ['user.id', 'follower.id'], {
  unique: true,
})
export class Follower extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  follower: User;

  constructor(data?: Partial<Follower>) {
    super(data);
    this.user = data?.user;
    this.follower = data?.follower;
  }
}
