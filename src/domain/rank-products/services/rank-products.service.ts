import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { CreateFeedRankProductPayload } from 'src/event-handler/types';
import { CreateRankProductDTO, ListRankProductDTO } from '../dto';
import { keyBy } from 'lodash';

@Injectable()
export class RankProductsService {
  constructor(
    private _rankProductRepository: RankProductRepository,
    private _fileService: FilesService,
    private _brandRepository: BrandRepository,
    private _categoryRepository: CategoryRepository,
    private _evenEmitter: EventEmitter2,
  ) {}

  public async create(dto: CreateRankProductDTO, user: User) {
    const { brand, category } = await this.assertDto(dto);
    const instance = new RankProduct(dto);
    instance.brand = brand;
    instance.category = category;
    instance.createdBy = user;
    await this.handleInsertFile(instance);
    const rankProduct = await this._rankProductRepository.save(instance);
    this._evenEmitter.emit(
      EVENTS.FEED_ACTIVITY.CREATE_RATING,
      new CreateFeedRankProductPayload({
        rankProduct,
        user,
      }),
    );
    return rankProduct;
  }

  public async list(dto: ListRankProductDTO) {
    const [items, total] = await this._rankProductRepository.list(dto);
    items.forEach((el) => {
      el.createdBy = new User(el.createdBy).mainInfo();
    });
    return {
      items,
      total,
    };
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
}
