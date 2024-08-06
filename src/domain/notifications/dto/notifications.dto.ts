import { IsOptional } from 'class-validator';
import { BaseFilter } from 'src/library';

export class ListNotificationsDto extends BaseFilter {
  @IsOptional()
  senderId: number;

  @IsOptional()
  receiverId: number;

  // type: follow | wishlist
  // productId?: if wishlist
  // seen: true | false
}
