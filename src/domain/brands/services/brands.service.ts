import { Injectable, NotFoundException } from '@nestjs/common';
import { COMMON_CONSTANT } from 'src/constants';
import { Brand, BrandRepository, RankProduct, User } from 'src/database';
import { FilesService } from 'src/domain/files';
import { RankProductsService } from 'src/domain/rank-products';
import { CreateBrandDTO, ListBrandDTO } from '../dto';

@Injectable()
export class BrandsService {
  constructor(
    private _brandRepository: BrandRepository,
    private _fileService: FilesService,
    private _ratingService: RankProductsService,
  ) {}
  public async create(dto: CreateBrandDTO, user: User) {
    const instance = new Brand(dto);
    instance.user = user;
    await this.handleInsertFiles(instance);
    return this._brandRepository.save(instance);
  }

  public async list(dto: ListBrandDTO, mapRating = true) {
    const [items, total] = await this._brandRepository.list(dto);
    if (mapRating) {
      await this._mapOverallRating(items);
    }
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
    brand.rankProducts = await this._ratingService.getBrandRatings(
      brand.id,
      user.id,
    );
    return brand;
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

  private async _mapOverallRating(brands: Brand[]) {
    const overallRanking = await this._ratingService.getBrandsOverallRanking(
      brands.map((el) => el.id),
    );

    for (const brand of brands) {
      brand.overallRanking = RankProduct.getOverallRanking(
        overallRanking[brand.id]?.avg,
      );
    }
  }
}
