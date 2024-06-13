import { Injectable } from '@nestjs/common';
import {
  FEED_ACTIVITY_TYPE,
  FeedActivity,
  FeedActivityRepository,
  Rating,
  User,
} from 'src/database';
import { ListFeedActivitiesDTO } from '../dto';

@Injectable()
export class FeedActivitiesService {
  constructor(private _feedActivityRepository: FeedActivityRepository) {}

  public async createRatingFeed(rating: Rating, user: User) {
    const instance = new FeedActivity({
      referenceId: rating.id,
      createdBy: user,
      type: FEED_ACTIVITY_TYPE.RATING,
      title: rating.name,
    });
    return this._feedActivityRepository.save(instance);
  }

  public async list(dto: ListFeedActivitiesDTO) {
    const [items, total] = await this._feedActivityRepository.list(dto);
    items.forEach((item) => {
      item.createdBy = new User(item.createdBy).mainInfo();
      if (item.rating) {
        item.rating.createdBy = item.createdBy;
      }
    });
    return { items, total };
  }
}
