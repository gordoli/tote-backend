import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, TransformBoolean } from 'src/library';

export class CreateRankProductDTO {
  @IsNumber()
  @Type(() => Number)
  rate: number;

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

export class ListRankProductDTO extends BaseFilter {
  @IsOptional()
  @Type(() => Number)
  createdBy: number;

  @IsOptional()
  name: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: number;

  @IsOptional()
  @Type(() => Number)
  category: number;

  @IsOptional()
  @Type(() => Number)
  brandId: number;

  @IsOptional()
  @TransformBoolean()
  isOnlyFriend: boolean;

  @IsOptional()
  userId: number;
}
