import { IsOptional } from 'class-validator';
import { BaseFilter, TransformBoolean } from 'src/library';

export class ListFeedsDTO extends BaseFilter {
  @IsOptional()
  @TransformBoolean()
  isOnlyFriend: boolean;

  @IsOptional()
  userId: string;
}
