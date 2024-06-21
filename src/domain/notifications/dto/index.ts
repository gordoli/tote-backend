import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Follower } from 'src/database';
import { BaseFilter } from 'src/library';

export class NotificationsDTO extends BaseFilter {
  @IsOptional()
  @Type(() => Number)
  user: number;

  @IsOptional()
  @Type(() => Number)
  follower: number;

  @IsOptional()
  target: keyof Follower;
}
