import { Controller, Get, Query, Res } from '@nestjs/common';
import { User } from 'src/database';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { ListNotificationsDto } from '../dto';
import { NotificationsService } from '../services';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
// TODO: AuthGuard
export class NotificationsController extends BaseController {
  constructor(private _notificationsService: NotificationsService) {
    super();
  }

  @Get()
  public async list(
    @CurrentUser() user: User,
    @Query() query: ListNotificationsDto,
  ) {
    query.receiverId = user.id;
    const { items, total } = await this._notificationsService.list(query);
    return items;
  }
}
