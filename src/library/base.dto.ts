import { Transform, Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class BaseFilter {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  page: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  perPage: number;
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (err) {
      return false;
    }
  })
  @IsObject({
    message: 'Invalid filter',
  })
  @IsOptional()
  filter: Record<string, any>;
  constructor(data?: Partial<BaseFilter>) {
    if (data) {
      const { page = 1, perPage = 10, ...filter } = data;
      delete filter.filter;
      this.page = page;
      this.perPage = perPage;
      this.filter = filter;
    }
  }

  get skip() {
    const page = this.page || 1;
    const perPage = this.page || 10;
    return (page - 1) * perPage;
  }

  get take() {
    return this.perPage || 10;
  }
}
