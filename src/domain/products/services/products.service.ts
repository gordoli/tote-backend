import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { keyBy } from 'lodash';
import { COMMON_CONSTANT, EVENTS } from 'src/constants';
import {
  BrandRanking,
  BrandRepository,
  CategoryRepository,
  Product,
  ProductRepository,
  User,
} from 'src/database';
import { FilesService } from 'src/domain/files';
import { WishListService } from 'src/domain/wish-lists';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
} from 'src/event-handler/types';
import { CreateProductDTO, ListProductDTO, UpdateProductDTO } from '../dto';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class ProductsService {
  constructor(
    private _rankProductRepository: ProductRepository,
    private _fileService: FilesService,
    private _brandRepository: BrandRepository,
    private _categoryRepository: CategoryRepository,
    private _eventEmitter: EventEmitter2,
    private _wishListService: WishListService,
  ) {}

  public async create(dto: CreateProductDTO, user: User) {
    const { brand, category } = await this.assertDto(dto);
    const instance = new Product(dto);
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

  public async update(id: string, dto: UpdateProductDTO, user: User) {
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
    await this.handleInsertFile(rankProduct);
    return this._rankProductRepository.save(rankProduct);
  }

  public async listByUser(userId: string, dto: ListProductDTO) {
    dto.createdBy = userId;

    const [items, total] = await this._rankProductRepository.listByUser(dto);
    return {
      items,
      total,
    };
  }

  public async list(dto: ListProductDTO) {
    const [items, total] = await this._rankProductRepository.list(dto);
    return {
      items,
      total,
    };
  }

  public async mapWishlisted(items: Product[], userId: string) {
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

  public async handleInsertFile(rankProduct: Product) {
    if (rankProduct.image) {
      rankProduct.image = await this._fileService.storePermanent(
        rankProduct.image,
        COMMON_CONSTANT.FOLDER.RATINGS,
      );
    }
    return rankProduct;
  }

  public async assertDto(dto: CreateProductDTO) {
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
    brandId: string,
    userId: string,
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
      friendsRating: Product.getOverallRanking(friendsRating),
      overallRanking: Product.getOverallRanking(overallRanking),
      userRating: Product.getOverallRanking(userRating),
      totalRanking,
    });
  }

  public async getBrandsOverallRanking(brandIds: string[]) {
    const overallRatings =
      await this._rankProductRepository.overallRatingBrands(brandIds);
    return keyBy(overallRatings, 'brandId');
  }

  public async dictionaryByIds(ids: string[]) {
    if (ids.length) {
      const rankProducts = await this._rankProductRepository.findByIds(ids);
      return keyBy(rankProducts, 'id');
    }
    return {};
  }
}
