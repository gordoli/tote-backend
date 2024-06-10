import { Injectable, NotFoundException } from '@nestjs/common';
import { keyBy } from 'lodash';
import { COMMON_CONSTANT } from 'src/constants';
import { Brand, BrandRepository, Rating, User } from 'src/database';
import { FilesService } from 'src/domain/files';
import { RatingsService } from 'src/domain/ratings';
import { CreateBrandDTO, ListBrandDTO } from '../dto';

@Injectable()
export class BrandsService {
  constructor(
    private _brandRepository: BrandRepository,
    private _fileService: FilesService,
    private _ratingService: RatingsService,
  ) {}
  public async create(dto: CreateBrandDTO, user: User) {
    const instance = new Brand(dto);
    instance.user = user;
    await this.handleInsertFiles(instance);
    return this._brandRepository.save(instance);
  }

  public async list(dto: ListBrandDTO) {
    const [items, total] = await this._brandRepository.list(dto);

    items.forEach((el) => {
      this.handleStoreFiles(el);
    });
    await this._mapOverallRating(items);
    return {
      items,
      total,
    };
  }

  public async detailById(id: number, user: User) {
    const brand = await this._brandRepository.findOneBy({ id });
    if (!brand) {
      throw new NotFoundException(`Brand id ${id} not found`);
    }
    brand.ratings = await this._ratingService.getBrandRatings(
      brand.id,
      user.id,
    );
    return this.handleStoreFiles(brand);
  }

  public async handleInsertFiles(brand: Brand) {
    if (brand.logo) {
      brand.logo = await this._fileService.storePermanent(
        brand.logo,
        COMMON_CONSTANT.FOLDER.BRANDS,
      );
    }
    if (brand.cover) {
      brand.cover = await this._fileService.storePermanent(
        brand.cover,
        COMMON_CONSTANT.FOLDER.BRANDS,
      );
    }
    return brand;
  }

  public handleStoreFiles(brand: Brand) {
    if (brand.logo) {
      brand.logo = this._fileService.getUrl(brand.logo);
    }
    if (brand.cover) {
      brand.cover = this._fileService.getUrl(brand.cover);
    }
    return brand;
  }

  private async _mapOverallRating(brands: Brand[]) {
    const overallRating = await this._ratingService.getBrandsOverallRatings(
      brands.map((el) => el.id),
    );

    for (const brand of brands) {
      brand.overallRating = Rating.getOverallRating(
        overallRating[brand.id]?.avg,
      );
    }
  }
}
