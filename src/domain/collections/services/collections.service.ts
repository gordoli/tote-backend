import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Collection,
  CollectionFeed,
  CollectionFeedRepository,
  CollectionRepository,
  FeedActivityRepository,
  User,
} from 'src/database';
import { AddFeedCollectionDTO, CreateCollectionDTO, WishListDTO } from '../dto';

@Injectable()
export class CollectionsService {
  constructor(
    private _collectionRepository: CollectionRepository,
    private _collectionFeedRepository: CollectionFeedRepository,
    private _feedActivityRepository: FeedActivityRepository,
  ) {}

  public async createCollection(dto: CreateCollectionDTO, user: User) {
    const instance = new Collection(dto);
    instance.createdBy = user;
    return this._collectionRepository.save(instance);
  }

  public async userCollections(user: User) {
    const collections = await this._collectionRepository.userList(user.id);
    return {
      items: collections,
      total: collections.length,
    };
  }

  public async addFeedToCollection(
    id: number,
    dto: AddFeedCollectionDTO,
    user: User,
  ) {
    const { feedId } = dto;
    const { feed } = await this._assertAddFeedDto(id, feedId, user.id);
    const instance = new CollectionFeed({
      collection: new Collection({ id }),
      feed,
      feedType: feed.type,
      referenceId: feed.referenceId,
      createdBy: user,
    });
    return this._collectionFeedRepository.upsert(instance, [
      'feed',
      'collection',
    ]);
  }

  private async _assertAddFeedDto(id: number, feedId: number, userId: number) {
    const [feed, isExistCollection] = await Promise.all([
      feedId
        ? this._feedActivityRepository.findOneBy({
            id: feedId,
          })
        : null,
      userId
        ? this._collectionRepository.existsBy({
            id,
            createdBy: { id: userId },
          })
        : null,
    ]);
    if (feedId && !feed) {
      throw new NotFoundException(`Feed id ${feedId} not found!`);
    }
    if (id && !isExistCollection) {
      throw new NotFoundException(`Collection id ${id} not found!`);
    }
    return {
      feed,
    };
  }

  public async userCollectionFeeds(user: User, dto: WishListDTO) {
    const [items, total] = await this._collectionFeedRepository.userList(
      user.id,
      dto,
    );
    items.forEach((el) => {
      if (el.feed.createdBy) {
        el.feed.createdBy = new User(el.feed.createdBy).mainInfo();
      }
    });
    return {
      items,
      total,
    };
  }
}
