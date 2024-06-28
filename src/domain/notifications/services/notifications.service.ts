import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/database';
import { ListNotificationsDto } from '../dto';

@Injectable()
export class NotificationsService {
  constructor(private _notificationRepository: NotificationRepository) {}

  public async list(dto: ListNotificationsDto) {
    const [items, total] = await this._notificationRepository.list(dto);
    return {
      items,
      total,
    };
  }
}
