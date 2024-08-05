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
import { WishlistService } from 'src/domain/wishlists';
import {
  FEED_PAYLOAD_ACTION,
  HandleFeedPayload,
} from 'src/event-handler/types';
import { CreateProductDTO, ListProductDTO, UpdateProductDTO } from '../dto';
import { HttpExceptionFilter } from 'src/library';

@Injectable()
export class ProductsService {
  constructor(
    private _productRepository: ProductRepository,
    private _fileService: FilesService,
    private _brandRepository: BrandRepository,
    private _categoryRepository: CategoryRepository,
    private _eventEmitter: EventEmitter2,
    private _wishListService: WishlistService,
  ) {}

  public async create(dto: CreateProductDTO, user: User) {
    const { brand, category } = await this.assertDto(dto);
    const instance = new Product(dto);
    instance.brand = brand;
    instance.category = category;
    instance.createdBy = user;
    await this.handleInsertFile(instance);
    const product = await this._productRepository.save(instance);
    const payload: HandleFeedPayload = {
      data: product,
      user,
      action: FEED_PAYLOAD_ACTION.ADD_RANK_PRODUCT,
    };
    this._eventEmitter.emit(EVENTS.FEED_ACTIVITY.HANDLE, payload);
    return product;
  }

  public async update(id: string, dto: UpdateProductDTO, user: User) {
    const product = await this._productRepository.findOneBy({
      createdBy: { id: user.id },
      id,
    });
    if (!product) {
      HttpExceptionFilter.throwError(
        {
          code: 'not_found_rank_product',
          message: `Rank product id ${id} not found!`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const { brand = product.brand, category = product.category } =
      await this.assertDto(dto);

    product.brand = brand;
    product.category = category;

    for (const key in dto) {
      product[key] = dto[key] || product[key];
    }
    await this.handleInsertFile(product);
    return this._productRepository.save(product);
  }

  public async listByUser(userId: string, dto: ListProductDTO) {
    dto.createdBy = userId;

    const [items, total] = await this._productRepository.listByUser(dto);
    return {
      items,
      total,
    };
  }

  public async list(dto: ListProductDTO) {
    const [items, total] = await this._productRepository.list(dto);
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

  public async handleInsertFile(product: Product) {
    if (product.image) {
      product.image = await this._fileService.storePermanent(
        product.image,
        COMMON_CONSTANT.FOLDER.RATINGS,
      );
    }
    return product;
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
        this._productRepository.overallRatingBrandByUser(brandId, userId),
        this._productRepository.overallFriendsRatingBrandByUser(
          brandId,
          userId,
        ),
        this._productRepository.overallRatingBrand(brandId),
        this._productRepository.countBy({ brand: { id: brandId } }),
      ]);
    return new BrandRanking({
      friendsRating: Product.getOverallRanking(friendsRating),
      overallRanking: Product.getOverallRanking(overallRanking),
      userRating: Product.getOverallRanking(userRating),
      totalRanking,
    });
  }

  public async getBrandsOverallRanking(brandIds: string[]) {
    const overallRatings = await this._productRepository.overallRatingBrands(
      brandIds,
    );
    return keyBy(overallRatings, 'brandId');
  }

  public async dictionaryByIds(ids: string[]) {
    if (ids.length) {
      const products = await this._productRepository.findByIds(ids);
      return keyBy(products, 'id');
    }
    return {};
  }
}
