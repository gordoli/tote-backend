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

@Injectable()
export class WishListService {
  constructor(
    private _wishListRepository: CustomListRepository,
    private _wishListFeedRepository: WishListRepository,
    private _feedRepository: FeedRepository,
    private _rankProductRepository: RankProductRepository,
    private _userRepository: UserRepository,
  ) {}

  public async createWishList(dto: CreateWishListDTO, user: User) {
    const instance = new CustomList(dto);
    instance.user = user;
    return this._wishListRepository.save(instance);
  }

  public async userWishLists(user: User) {
    const collections = await this._wishListRepository.userList(user.id);
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
        ? this._wishListRepository.existsBy({
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
    const rankProduct = await this._rankProductRepository.findOneBy({
      id: rankProductId,
    });
    if (!rankProduct) {
      throw new NotFoundException(
        `Rank product id ${rankProductId} not found!`,
      );
    }
    return this._wishListFeedRepository.save(
      new WishList({
        user,
        product: rankProduct,
      }),
    );
  }

  public async wishListProducts(dto: WishListProductDTO) {
    const [items, total] = await this._wishListFeedRepository.wishListProducts(
      dto,
    );
    return {
      items,
      total,
    };
  }

  public async userWishlistProducts(userId: number, dto: WishListProductDTO) {
    dto.user = userId;
    const [user, [items, total]] = await Promise.all([
      this._userRepository.sanitizedUser(userId),
      this._wishListFeedRepository.wishLists(dto),
    ]);
    return {
      user,
      items,
      total,
    };
  }
}
