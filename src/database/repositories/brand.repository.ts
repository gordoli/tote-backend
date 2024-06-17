import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Brand } from '../entities';
import { BaseRepository } from './base.repository';
import { ListBrandDTO } from 'src/domain';
import { BaseFilter } from 'src/library';

@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(_dataSource: DataSource) {
    super(Brand, _dataSource);
  }

  public async list(dto: ListBrandDTO) {
    const { userId, name, ...rest } = dto;
    const query = this._buildQuery(
      new BaseFilter(rest),
      this.createQueryBuilder('brand'),
    );
    if (userId) {
      query.andWhere('brand.user=:userId', { userId });
    }
    if (name) {
      query.andWhere('brand.name LIKE :name', { name: `%${name}%` });
    }
    return query.orderBy({ id: 'DESC' }).getManyAndCount();
  }
}
