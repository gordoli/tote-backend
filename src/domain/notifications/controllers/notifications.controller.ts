import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { ListNotificationsDto } from '../dto';
import { NotificationsService } from '../services';

@Controller('notifications')
@UseGuards(JwtAuthUserGuard)
export class NotificationsController extends BaseController {
  constructor(private _notificationsService: NotificationsService) {
    super();
  }

  @Get()
  public async list(
    @CurrentUser() user: User,
    @Query() query: ListNotificationsDto,
    @Res() response: Response,
  ) {
    query.receiverId = user.id;
    const { items, total } = await this._notificationsService.list(query);
    return this.responseCustom(response, items, { total });
  }
}
