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
import { AddFeedCollectionDTO, CreateCollectionDTO, WishListDTO } from '../dto';
import { CollectionsService } from '../services';

@Controller('user/collections')
@UseGuards(JwtAuthUserGuard)
export class UserCollectionsController extends BaseController {
  constructor(private _collectionsService: CollectionsService) {
    super();
  }

  @Get()
  public async list(@CurrentUser() user: User, @Res() response: Response) {
    const { items, total } = await this._collectionsService.userCollections(
      user,
    );
    this.responseCustom(response, items, { total });
  }

  @Get('feeds')
  public async feeds(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Query() dto: WishListDTO,
  ) {
    const { items, total } = await this._collectionsService.userCollectionFeeds(
      user,
      dto,
    );
    this.responseCustom(response, items, { total });
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: CreateCollectionDTO,
  ) {
    const collection = await this._collectionsService.createCollection(
      dto,
      user,
    );
    this.responseCustom(response, collection);
  }

  @Post(':id')
  public async addFeed(
    @Param('id') id: number,
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: AddFeedCollectionDTO,
  ) {
    await this._collectionsService.addFeedToCollection(id, dto, user);
    this.responseCustom(response);
  }
}
