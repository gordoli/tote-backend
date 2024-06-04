import { Injectable } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { User, UserProvider } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private _dataSource: DataSource) {
    super(User, _dataSource);
  }

  public async updateRefreshToken(id: number, refreshToken: string) {
    return this.update({ id }, { refreshToken });
  }

  public async deleteRefreshToken(id: number) {
    return this.update({ id }, { refreshToken: null });
  }

  public async findByIdentity(username: string) {
    return this.findOneBy([
      { username, deletedAt: IsNull() },
      { email: username, deletedAt: IsNull() },
    ]);
  }

  public async findByEmail(email: string) {
    return this.findOneBy({ email });
  }

  public async verifyByEmail(email: string) {
    return this.update(
      { email, isVerified: false, deletedAt: IsNull() },
      { isVerified: true },
    );
  }

  public async updatePasswordByEmail(email: string, password: string) {
    return this.update({ email, deletedAt: IsNull() }, { password });
  }

  public async updatePasswordById(id: number, password: string) {
    return this.update({ id }, { password });
  }

  public async socialUser(socialId: string, provider: UserProvider) {
    return this.findOneBy({ provider, socialId });
  }

  public async getPasswordById(id: number) {
    const data = await this.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    return data?.password;
  }
}
