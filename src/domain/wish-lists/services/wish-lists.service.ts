import { Injectable, NotFoundException } from '@nestjs/common';
import {
  WishList,
  WishListFeed,
  WishListFeedRepository,
  WishListRepository,
  FeedRepository,
  User,
} from 'src/database';
import { AddFeedWishListDTO, CreateWishListDTO, WishListDTO } from '../dto';

@Injectable()
export class WishListService {
  constructor(
    private _wishListRepository: WishListRepository,
    private _wishListFeedRepository: WishListFeedRepository,
    private _feedRepository: FeedRepository,
  ) {}

  public async createWishList(dto: CreateWishListDTO, user: User) {
    const instance = new WishList(dto);
    instance.createdBy = user;
    return this._wishListRepository.save(instance);
  }

  public async userWishLists(user: User) {
    const collections = await this._wishListRepository.userList(user.id);
    return {
      items: collections,
      total: collections.length,
    };
  }

  public async addFeedToCollection(
    id: number,
    dto: AddFeedWishListDTO,
    user: User,
  ) {
    const { feedId } = dto;
    const { feed } = await this._assertAddFeedDto(id, feedId, user.id);
    const instance = new WishListFeed({
      wishList: new WishList({ id }),
      feed,
      feedType: feed.type,
      referenceId: feed.referenceId,
      createdBy: user,
    });
    return this._wishListFeedRepository.upsert(instance, ['feed', 'wishList']);
  }

  private async _assertAddFeedDto(id: number, feedId: number, userId: number) {
    const [feed, isExistCollection] = await Promise.all([
      feedId
        ? this._feedRepository.findOneBy({
            id: feedId,
          })
        : null,
      userId
        ? this._wishListRepository.existsBy({
            id,
            createdBy: { id: userId },
          })
        : null,
    ]);
    if (feedId && !feed) {
      throw new NotFoundException(`Feed id ${feedId} not found!`);
    }
    if (id && !isExistCollection) {
      throw new NotFoundException(`WishList id ${id} not found!`);
    }
    return {
      feed,
    };
  }

  public async userWishListFeeds(user: User, dto: WishListDTO) {
    const [items, total] = await this._wishListFeedRepository.userList(
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