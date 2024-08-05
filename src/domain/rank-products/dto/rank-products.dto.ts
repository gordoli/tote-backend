import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { BaseFilter, TransformBoolean } from 'src/library';

export class CreateProductDTO {
  @IsNumber()
  @Type(() => Number)
  rate: number;

  @IsNotEmpty()
  @Type(() => Number)
  brandId: string;

  @IsNotEmpty()
  @Type(() => Number)
  categoryId: string;

  @IsOptional()
  @Type(() => Number)
  preferProductId: string;

  @IsOptional()
  link: string;

  @IsOptional()
  image: string;

  @IsOptional()
  name: string;
}

export class UpdateProductDTO extends CreateProductDTO {
  @IsOptional()
  @Type(() => Number)
  rate: number;

  @IsOptional()
  @Type(() => Number)
  brandId: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: string;
}

export class ListProductDTO extends BaseFilter {
  @IsOptional()
  @Type(() => Number)
  createdBy: string;

  @IsOptional()
  name: string;

  @IsOptional()
  @Type(() => Number)
  categoryId: string;

  @IsOptional()
  @Type(() => Number)
  category: number;

  @IsOptional()
  @Type(() => Number)
  brandId: string;

  @IsOptional()
  @TransformBoolean()
  isOnlyFriend: boolean;

  @IsOptional()
  userId: string;
}
