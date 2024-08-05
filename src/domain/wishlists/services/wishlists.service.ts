import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Dictionary, keyBy } from 'lodash';
import { EVENTS } from 'src/constants';
import { LoggerService } from 'src/core';
import {
  CustomList,
  CustomListRepository,
  FeedRepository,
  ProductRepository,
  User,
  UserRepository,
  Wishlist,
  WishlistRepository,
} from 'src/database';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
} from 'src/event-handler/types';
import { In } from 'typeorm';
import { CreateWishlistDTO, WishlistProductDTO } from '../dto';

@Injectable()
export class WishlistService {
  private _logger = new LoggerService(WishlistService.name);
  constructor(
    private _customListRepository: CustomListRepository,
    private _wishListRepository: WishlistRepository,
    private _feedRepository: FeedRepository,
    private _productRepository: ProductRepository,
    private _userRepository: UserRepository,
    private _eventEmitter: EventEmitter2,
  ) {}

  public async createWishlist(dto: CreateWishlistDTO, user: User) {
    const instance = new CustomList(dto);
    instance.user = user;
    return this._customListRepository.save(instance);
  }

  public async userWishlists(user: User) {
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

  public async addProduct(user: User, productId: string) {
    const [product, existed] = await Promise.all([
      this._productRepository.findOneBy({
        id: productId,
      }),
      this._wishListRepository.findOneBy({
        user: { id: user.id },
        product: { id: productId },
      }),
    ]);
    if (!product) {
      throw new NotFoundException(`Rank product id ${productId} not found!`);
    }
    if (existed) {
      return existed;
    }
    const wishlist = await this._wishListRepository.save(
      new Wishlist({
        user,
        product: product,
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

  public async deleteProduct(user: User, productId: string) {
    const wishlist = await this._wishListRepository.findOneBy({
      user: { id: user.id },
      product: { id: productId },
    });
    if (wishlist) {
      const result = await this._wishListRepository.delete({
        user: { id: user.id },
        product: { id: productId },
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

  public async wishListProducts(dto: WishlistProductDTO) {
    const [items, total] = await this._wishListRepository.wishListProducts(dto);
    return {
      items,
      total,
    };
  }

  public async userWishlistProducts(userId: string, dto: WishlistProductDTO) {
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
  ): Promise<Dictionary<Wishlist>> {
    if (productIds.length) {
      const foundWishlisted =
        await this._wishListRepository.existsByProductIdsAndUser(
          productIds,
          userId,
        );
      return keyBy(foundWishlisted, 'product.id');
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
