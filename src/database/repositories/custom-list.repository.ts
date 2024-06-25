import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CustomList } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class CustomListRepository extends BaseRepository<CustomList> {
  constructor(_dataSource: DataSource) {
    super(CustomList, _dataSource);
  }

  public async userList(userId: number) {
    return this.createQueryBuilder('customList')
      .where('customList.user =:userId', { userId })
      .getMany();
  }
}
