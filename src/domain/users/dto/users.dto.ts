import { IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class SearchMembersDto extends BaseFilter {
  @IsOptional()
  email: string;

  @IsOptional()
  username: string;

  @IsOptional()
  name: string;
}
