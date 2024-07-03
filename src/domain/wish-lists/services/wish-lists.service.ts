import { Injectable, NotFoundException } from '@nestjs/common';
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
import { CreateWishListDTO, WishListProductDTO } from '../dto';
import { LoggerService } from 'src/core';
import { Dictionary, keyBy } from 'lodash';

@Injectable()
export class WishListService {
  private _logger = new LoggerService(WishListService.name);
  constructor(
    private _customListRepository: CustomListRepository,
    private _wishListRepository: WishListRepository,
    private _feedRepository: FeedRepository,
    private _rankProductRepository: RankProductRepository,
    private _userRepository: UserRepository,
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

  private async _assertAddFeedDto(id: number, feedId: number, userId: number) {
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

  public async addProduct(user: User, rankProductId: number) {
    const [rankProduct, wishList] = await Promise.all([
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
    if (wishList) {
      return wishList;
    }
    return this._wishListRepository.save(
      new WishList({
        user,
        product: rankProduct,
      }),
    );
  }

  public async deleteProduct(user: User, rankProductId: number) {
    const result = await this._wishListRepository.delete({
      user,
      product: { id: rankProductId },
    });
    this._logger.debug('Delete product result', result);
    return result;
  }

  public async wishListProducts(dto: WishListProductDTO) {
    const [items, total] = await this._wishListRepository.wishListProducts(dto);
    return {
      items,
      total,
    };
  }

  public async userWishlistProducts(userId: number, dto: WishListProductDTO) {
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
    productIds: number[],
    userId: number,
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
}
