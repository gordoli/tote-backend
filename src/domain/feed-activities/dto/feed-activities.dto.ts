import { IsOptional } from 'class-validator';
import { BaseFilter, TransformBoolean } from 'src/library';

export class ListFeedActivitiesDTO extends BaseFilter {
  @IsOptional()
  @TransformBoolean()
  isOnlyFriend: boolean;

  @IsOptional()
  userId: number;
}
