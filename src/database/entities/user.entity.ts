import { SocialData } from 'src/domain/auth/types';
import { Column, Entity } from 'typeorm';
import { BaseEntity, BaseStatus } from './base.entity';

export enum UserProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ default: BaseStatus.Active })
  status: BaseStatus;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: UserProvider.EMAIL })
  provider: UserProvider;

  @Column({ nullable: true })
  socialId: string;

  constructor(data?: Partial<User>) {
    super(data);
    this.username = data?.username;
    this.email = data?.email;
    this.password = data?.password;
    this.refreshToken = data?.refreshToken;
    this.deletedAt = data?.deletedAt;
    this.status = data?.status;
    this.isVerified = data?.isVerified;
    this.provider = data?.provider;
    this.socialId = data?.socialId;
    this.firstName = data?.firstName;
    this.lastName = data?.lastName;
    this.avatar = data?.avatar;
  }

  public serialize() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      deletedAt: this.deletedAt,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
      provider: this.provider,
      socialId: this.socialId,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
    };
  }

  static mapSocialProfile(socialData: SocialData, provider: UserProvider) {
    const { id, email, firstName, lastName } = socialData;
    return new User({
      provider,
      socialId: id,
      username: User.getUsernameByEmail(email),
      email,
      firstName,
      lastName,
    });
  }

  static getUsernameByEmail(email: string) {
    return email.split('@')[0];
  }
}
