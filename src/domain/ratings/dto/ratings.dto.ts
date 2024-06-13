import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RATING_RATE } from 'src/database';
import { BaseFilter, TransformBoolean } from 'src/library';

export class CreateRatingDTO {
  @IsEnum(RATING_RATE)
  @IsNotEmpty()
  rate: RATING_RATE;

  @IsNotEmpty()
  @Type(() => Number)
  brandId: number;

  @IsNotEmpty()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  preferProductId: number;

  @IsOptional()
  link: string;

  @IsOptional()
  image: string;

  @IsOptional()
  name: string;
}

export class ListRatingDTO extends BaseFilter {
  @IsOptional()
  createdBy: number;

  @IsOptional()
  name: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  brandId: number;

  @IsOptional()
  @TransformBoolean()
  isOnlyFriend: boolean;

  @IsOptional()
  userId: number;
}
