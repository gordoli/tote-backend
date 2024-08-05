import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class CreateWishlistDTO {
  @IsNotEmpty()
  name: string;
}

export class AddFeedWishlistDTO {
  @IsNotEmpty()
  feedId: string;
}

export class WishlistDTO extends BaseFilter {
  @IsOptional()
  name: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: string;

  @IsOptional()
  @Type(() => Number)
  collectionId: string;
}
