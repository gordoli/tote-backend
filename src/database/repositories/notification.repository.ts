import { Injectable } from '@nestjs/common';
import { ListNotificationsDto } from 'src/domain';
import { BaseFilter } from 'src/library';
import { DataSource } from 'typeorm';
import { Notification } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(_dataSource: DataSource) {
    super(Notification, _dataSource);
  }

  public async list(dto: ListNotificationsDto) {
    return this._buildQuery(
      new BaseFilter(dto),
      this.createQueryBuilder('notifications'),
    ).getManyAndCount();
  }

  // TODO: get notifications by reciever
}
