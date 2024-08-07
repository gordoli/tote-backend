import { Injectable } from '@nestjs/common';
import { SearchMembersDto } from 'src/domain/users/dto';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { User, UserProvider } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  public static getMainSelect(alias: string) {
    return UserRepository.MAIN_SELECT.map((column) => `${alias}.${column}`);
  }

  public static readonly MAIN_SELECT = [
    'id',
    'username',
    'email',
    'firstName',
    'lastName',
    'avatar',
  ];
  constructor(private _dataSource: DataSource) {
    super(User, _dataSource);
  }

  public async updateRefreshToken(id: string, refreshToken: string) {
    return this.update({ id }, { refreshToken });
  }

  public async deleteRefreshToken(id: string) {
    return this.update({ id }, { refreshToken: null });
  }

  public async findByIdentity(username: string) {
    return this.createQueryBuilder('users')
      .where(
        '(LOWER(users.username) = :username OR LOWER(users.email) = :username)',
        { username: username.toLowerCase() },
      )
      .andWhere('users.deletedAt IS NULL')
      .getOne();
  }

  public async findByLowerEmail(email: string) {
    return this.createQueryBuilder('users')
      .where('LOWER(users.email) = :email', { email: email?.toLowerCase() })
      .getOne();
  }

  public async findByLowerUsername(username: string) {
    return this.createQueryBuilder('users')
      .where('LOWER(users.username) = :username', {
        username: username?.toLowerCase(),
      })
      .getOne();
  }

  public async verifyByEmail(email: string) {
    return this.createQueryBuilder()
      .where('LOWER(email) = :email', { email: email?.toLowerCase() })
      .andWhere('isVerified = false')
      .andWhere('deletedAt IS NULL')
      .update()
      .set({
        isVerified: true,
      })
      .execute();
  }

  public async updatePasswordByEmail(email: string, password: string) {
    return this.createQueryBuilder()
      .where('LOWER(email) = :email', { email: email?.toLowerCase() })
      .andWhere('isVerified = false')
      .andWhere('deletedAt IS NULL')
      .update()
      .set({
        password,
      })
      .execute();
  }

  public async updatePasswordById(id: string, password: string) {
    return this.update({ id }, { password });
  }

  public async socialUser(socialId: string, provider: UserProvider) {
    return this.findOneBy({ provider, socialId });
  }

  public async getPasswordById(id: string) {
    const data = await this.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    return data?.password;
  }

  public async searchMembers(dto: SearchMembersDto) {
    const { name, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('users'),
    );
    if (name) {
      query.andWhere(
        "(CONCAT(users.firstName, ' ', users.lastName) ILIKE :searchName)",
        {
          searchName: `%${name}%`,
        },
      );
    }
    return query
      .select(UserRepository.getMainSelect('users'))
      .orderBy('users.id', 'DESC')
      .getManyAndCount();
  }
  public async sanitizedUser(id: string) {
    return this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .select(UserRepository.getMainSelect('user'))
      .getOne();
  }

  public async userFullInformation(id: string) {
    return this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.products', 'products')
      .leftJoinAndSelect('products.brand', 'brand')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('user.brands', 'brands')
      .getOne();
  }
}
