import { IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class ListNotificationsDto extends BaseFilter {
  @IsOptional()
  senderId: string;

  @IsOptional()
  receiverId: string;
}
