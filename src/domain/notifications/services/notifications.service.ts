import { Injectable } from '@nestjs/common';
import {
  NotificationRepository,
  Notification,
  User,
  NotificationType,
  RankProduct,
  RankProductRepository,
} from 'src/database';
import { ListNotificationsDto } from '../dto';

@Injectable()
export class NotificationsService {
  constructor(
    private _notificationRepository: NotificationRepository,
    private _rankProductRepository: RankProductRepository,
  ) {}

  public async list(dto: ListNotificationsDto) {
    const [items, total] = await this._notificationRepository.list(dto);
    return {
      items,
      total,
    };
  }

  public async createFollowingNotification(sender: User, receiverId: string) {
    const instance = new Notification();
    instance.type = NotificationType.FOLLOW;
    instance.sender = sender;
    instance.senderId = sender.id;
    instance.receiverId = receiverId;
    instance.createdAt = new Date();
    const newNotification = await this._notificationRepository.save(instance);
    return newNotification;
  }

  // Not sure what a wishlist notification is comprised of
  public async createWishlistNotification(sender: User, productId: string) {
    const instance = new Notification();
    const rankProduct = await this._rankProductRepository.findByIds([
      productId,
    ]);
    instance.type = NotificationType.WISHLIST;
    instance.sender = sender;
    instance.senderId = sender.id;
    instance.createdAt = new Date();
    instance.productId = productId;
    instance.receiverId = rankProduct[0].createdBy.id;
    console.log('hereeeeeee');
    const newNotification = await this._notificationRepository.save(instance);
    return newNotification;
  }
}
