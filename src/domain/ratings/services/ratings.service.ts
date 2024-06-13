import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { COMMON_CONSTANT, EVENTS } from 'src/constants';
import {
  BrandRatings,
  BrandRepository,
  CategoryRepository,
  Rating,
  RatingRepository,
  User,
} from 'src/database';
import { FilesService } from 'src/domain/files';
import { CreateFeedRatingPayload } from 'src/event-handler/types';
import { CreateRatingDTO, ListRatingDTO } from '../dto';
import { keyBy } from 'lodash';

@Injectable()
export class RatingsService {
  constructor(
    private _ratingRepository: RatingRepository,
    private _fileService: FilesService,
    private _brandRepository: BrandRepository,
    private _categoryRepository: CategoryRepository,
    private _evenEmitter: EventEmitter2,
  ) {}

  public async create(dto: CreateRatingDTO, user: User) {
    const { brand, category } = await this.assertDto(dto);
    const instance = new Rating(dto);
    instance.brand = brand;
    instance.category = category;
    instance.createdBy = user;
    await this.handleInsertFile(instance);
    const rating = await this._ratingRepository.save(instance);
    this._evenEmitter.emit(
      EVENTS.FEED_ACTIVITY.CREATE_RATING,
      new CreateFeedRatingPayload({
        rating,
        user,
      }),
    );
    return rating;
  }

  public async list(dto: ListRatingDTO) {
    const [items, total] = await this._ratingRepository.list(dto);
    items.forEach((el) => {
      el.createdBy = new User(el.createdBy).mainInfo();
    });
    return {
      items: items.map((el) => this.handleStoreFile(el)),
      total,
    };
  }

  public async handleInsertFile(rating: Rating) {
    if (rating.image) {
      rating.image = await this._fileService.storePermanent(
        rating.image,
        COMMON_CONSTANT.FOLDER.RATINGS,
      );
    }
    return rating;
  }

  public handleStoreFile(rating: Rating) {
    if (rating.image) {
      rating.image = this._fileService.getUrl(rating.image);
    }
    return rating;
  }

  public async assertDto(dto: CreateRatingDTO) {
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
  ): Promise<BrandRatings> {
    const [userRating, friendsRating, overallRating, totalProductsRated] =
      await Promise.all([
        this._ratingRepository.overallRatingBrandByUser(brandId, userId),
        this._ratingRepository.overallFriendsRatingBrandByUser(brandId, userId),
        this._ratingRepository.overallRatingBrand(brandId),
        this._ratingRepository.countBy({ brand: { id: brandId } }),
      ]);
    return new BrandRatings({
      friendsRating: Rating.getOverallRating(friendsRating),
      overallRating: Rating.getOverallRating(overallRating),
      userRating: Rating.getOverallRating(userRating),
      totalProductsRated,
    });
  }

  public async getBrandsOverallRatings(brands: number[]) {
    const overallRatings = await this._ratingRepository.overallRatingBrands(
      brands,
    );
    return keyBy(overallRatings, 'brandId');
  }
}
