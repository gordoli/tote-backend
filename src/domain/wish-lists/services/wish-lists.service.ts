import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Dictionary, keyBy } from 'lodash';
import { EVENTS } from 'src/constants';
import { LoggerService } from 'src/core';
import {
  CustomList,
  CustomListRepository,
  FeedRepository,
  RankProductRepository,
  User,
  UserRepository,
  WishList,
  WishListRepository,
} from 'src/database';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
} from 'src/event-handler/types';
import { In } from 'typeorm';
import { CreateWishListDTO, WishListProductDTO } from '../dto';

@Injectable()
export class WishListService {
  private _logger = new LoggerService(WishListService.name);
  constructor(
    private _customListRepository: CustomListRepository,
    private _wishListRepository: WishListRepository,
    private _feedRepository: FeedRepository,
    private _rankProductRepository: RankProductRepository,
    private _userRepository: UserRepository,
    private _eventEmitter: EventEmitter2,
  ) {}

  public async createWishList(dto: CreateWishListDTO, user: User) {
    const instance = new CustomList(dto);
    instance.user = user;
    return this._customListRepository.save(instance);
  }

  public async userWishLists(user: User) {
    const collections = await this._customListRepository.userList(user.id);
    return {
      items: collections,
      total: collections.length,
    };
  }

  private async _assertAddFeedDto(id: string, feedId: string, userId: string) {
    const [feed, isExistCollection] = await Promise.all([
      feedId
        ? this._feedRepository.findOneBy({
            id: feedId,
          })
        : null,
      userId
        ? this._customListRepository.existsBy({
            id,
            user: { id: userId },
          })
        : null,
    ]);
    if (feedId && !feed) {
      throw new NotFoundException(`Feed id ${feedId} not found!`);
    }
    if (id && !isExistCollection) {
      throw new NotFoundException(`CustomList id ${id} not found!`);
    }
    return {
      feed,
    };
  }

  public async addProduct(user: User, rankProductId: string) {
    const [rankProduct, existed] = await Promise.all([
      this._rankProductRepository.findOneBy({
        id: rankProductId,
      }),
      this._wishListRepository.findOneBy({
        user: { id: user.id },
        product: { id: rankProductId },
      }),
    ]);
    if (!rankProduct) {
      throw new NotFoundException(
        `Rank product id ${rankProductId} not found!`,
      );
    }
    if (existed) {
      return existed;
    }
    const wishlist = await this._wishListRepository.save(
      new WishList({
        user,
        product: rankProduct,
      }),
    );

    const payload: HandleFeedPayload = {
      data: wishlist,
      action: FEED_PAYLOAD_ACTION.ADD_WISHLIST,
      user,
    };
    this._eventEmitter.emit(EVENTS.FEED_ACTIVITY.HANDLE, payload);
    return wishlist;
  }

  public async deleteProduct(user: User, rankProductId: string) {
    const wishlist = await this._wishListRepository.findOneBy({
      user: { id: user.id },
      product: { id: rankProductId },
    });
    if (wishlist) {
      const result = await this._wishListRepository.delete({
        user: { id: user.id },
        product: { id: rankProductId },
      });
      this._logger.debug('Delete product result', result);
      const payload: HandleFeedPayload = {
        data: wishlist,
        action: FEED_PAYLOAD_ACTION.REMOVE_WISHLIST,
        user,
      };
      this._eventEmitter.emit(EVENTS.FEED_ACTIVITY.HANDLE, payload);
      return result;
    }
  }

  public async wishListProducts(dto: WishListProductDTO) {
    const [items, total] = await this._wishListRepository.wishListProducts(dto);
    return {
      items,
      total,
    };
  }

  public async userWishlistProducts(userId: string, dto: WishListProductDTO) {
    dto.user = userId;
    const [user, [items, total]] = await Promise.all([
      this._userRepository.sanitizedUser(userId),
      this._wishListRepository.wishLists(dto),
    ]);
    return {
      user,
      items,
      total,
    };
  }

  public async dictionaryUserProducts(
    productIds: string[],
    userId: string,
  ): Promise<Dictionary<WishList>> {
    if (productIds.length) {
      const foundWishListed =
        await this._wishListRepository.existsByProductIdsAndUser(
          productIds,
          userId,
        );
      return keyBy(foundWishListed, 'product.id');
    }
    return {};
  }

  public async feedWishlists(ids: string[]) {
    if (ids.length) {
      return this._wishListRepository.find({
        where: { id: In(ids) },
        loadRelationIds: {
          relations: ['product'],
          disableMixedMap: true,
        },
      });
    }
    return [];
  }
}
