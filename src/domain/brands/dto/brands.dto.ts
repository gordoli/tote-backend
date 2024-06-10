import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class CreateBrandDTO {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  cover: string;

  @IsOptional()
  logo: string;

  @IsOptional()
  website: string;

  @IsOptional()
  description: string;
}

export class ListBrandDTO extends BaseFilter {
  @IsOptional()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  name: string;
}
