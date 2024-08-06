import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { keyBy } from 'lodash';
import { COMMON_CONSTANT, EVENTS } from 'src/constants';
import {
  BrandRanking,
  BrandRepository,
  CategoryRepository,
  RankProduct,
  RankProductRepository,
  User,
} from 'src/database';
import { FilesService } from 'src/domain/files';
import { WishListService } from 'src/domain/wish-lists';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
} from 'src/event-handler/types';
import {
  CreateRankProductDTO,
  ListRankProductDTO,
  UpdateRankProductDTO,
} from '../dto';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class RankProductsService {
  constructor(
    private _rankProductRepository: RankProductRepository,
    private _fileService: FilesService,
    private _brandRepository: BrandRepository,
    private _categoryRepository: CategoryRepository,
    private _eventEmitter: EventEmitter2,
    private _wishListService: WishListService,
  ) {}

  public async create(dto: CreateRankProductDTO, user: User) {
    const { brand, category } = await this.assertDto(dto);
    const instance = new RankProduct(dto);
    instance.brand = brand;
    instance.category = category;
    instance.createdBy = user;
    await this.handleInsertFile(instance);
    const rankProduct = await this._rankProductRepository.save(instance);
    const payload: HandleFeedPayload = {
      data: rankProduct,
      user,
      action: FEED_PAYLOAD_ACTION.ADD_RANK_PRODUCT,
    };
    this._eventEmitter.emit(EVENTS.FEED_ACTIVITY.HANDLE, payload);
    return rankProduct;
  }

  public async update(id: number, dto: UpdateRankProductDTO, user: User) {
    const rankProduct = await this._rankProductRepository.findOneBy({
      createdBy: { id: user.id },
      id,
    });
    if (!rankProduct) {
      HttpExceptionFilter.throwError(
        {
          code: 'not_found_rank_product',
          message: `Rank product id ${id} not found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const { brand = rankProduct.brand, category = rankProduct.category } =
      await this.assertDto(dto);

    rankProduct.brand = brand;
    rankProduct.category = category;

    for (const key in dto) {
      rankProduct[key] = dto[key] || rankProduct[key];
    }
    // await this.handleInsertFile(rankProduct);
    return this._rankProductRepository.save(rankProduct);
  }

  public async listByUser(userId: number, dto: ListRankProductDTO) {
    dto.createdBy = userId;

    const [items, total] = await this._rankProductRepository.listByUser(dto);
    return {
      items,
      total,
    };
  }

  public async list(dto: ListRankProductDTO) {
    const [items, total] = await this._rankProductRepository.list(dto);
    return {
      items,
      total,
    };
  }

  public async mapWishlisted(items: RankProduct[], userId: number) {
    if (items.length) {
      const productIds = items.map((item) => item.id);
      const dictionary = await this._wishListService.dictionaryUserProducts(
        productIds,
        userId,
      );

      for (const item of items) {
        item.wishlisted = Boolean(dictionary[item.id]);
      }
    }
  }

  public async handleInsertFile(rankProduct: RankProduct) {
    if (rankProduct.image) {
      rankProduct.image = await this._fileService.storePermanent(
        rankProduct.image,
        COMMON_CONSTANT.FOLDER.RATINGS,
      );
    }
    return rankProduct;
  }

  public async assertDto(dto: CreateRankProductDTO) {
    const [brand, category] = await Promise.all([
      this._brandRepository.findOneBy({ id: dto.brandId }),
      this._categoryRepository.findOneBy({ id: dto.categoryId }),
    ]);
    if (dto.brandId && !brand) {
      throw new NotFoundException(`Brand id ${dto.categoryId} not found!`);
    }
    if (dto.categoryId && !category) {
      throw new NotFoundException(`Category id ${dto.brandId} not found!`);
    }
    return {
      brand,
      category,
    };
  }

  public async getBrandRatings(
    brandId: number,
    userId: number,
  ): Promise<BrandRanking> {
    const [userRating, friendsRating, overallRanking, totalRanking] =
      await Promise.all([
        this._rankProductRepository.overallRatingBrandByUser(brandId, userId),
        this._rankProductRepository.overallFriendsRatingBrandByUser(
          brandId,
          userId,
        ),
        this._rankProductRepository.overallRatingBrand(brandId),
        this._rankProductRepository.countBy({ brand: { id: brandId } }),
      ]);
    return new BrandRanking({
      friendsRating: RankProduct.getOverallRanking(friendsRating),
      overallRanking: RankProduct.getOverallRanking(overallRanking),
      userRating: RankProduct.getOverallRanking(userRating),
      totalRanking,
    });
  }

  public async getBrandsOverallRanking(brands: number[]) {
    const overallRatings =
      await this._rankProductRepository.overallRatingBrands(brands);
    return keyBy(overallRatings, 'brandId');
  }

  public async dictionaryByIds(ids: number[]) {
    if (ids.length) {
      const rankProducts = await this._rankProductRepository.findByIds(ids);
      return keyBy(rankProducts, 'id');
    }
    return {};
  }
}
