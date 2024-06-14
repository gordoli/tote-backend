import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class CreateCollectionDTO {
  @IsNotEmpty()
  name: string;
}

export class AddFeedCollectionDTO {
  @IsNotEmpty()
  feedId: number;
}

export class WishListDTO extends BaseFilter {
  @IsOptional()
  name: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  collectionId: number;
}
