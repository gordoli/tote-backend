import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { AddFeedWishListDTO, CreateWishListDTO, WishListDTO } from '../dto';
import { WishListService } from '../services';

@Controller('user/wish-lists')
@UseGuards(JwtAuthUserGuard)
export class UserWishListsController extends BaseController {
  constructor(private _collectionsService: WishListService) {
    super();
  }

  @Get()
  public async list(@CurrentUser() user: User, @Res() response: Response) {
    const { items, total } = await this._collectionsService.userWishLists(user);
    this.responseCustom(response, items, { total });
  }

  @Get('feeds')
  public async feeds(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Query() dto: WishListDTO,
  ) {
    const { items, total } = await this._collectionsService.userWishListFeeds(
      user,
      dto,
    );
    this.responseCustom(response, items, { total });
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: CreateWishListDTO,
  ) {
    const collection = await this._collectionsService.createWishList(dto, user);
    this.responseCustom(response, collection);
  }

  @Post(':id')
  public async addFeed(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: AddFeedWishListDTO,
  ) {
    await this._collectionsService.addFeedToCollection(id, dto, user);
    this.responseCustom(response);
  }
}
