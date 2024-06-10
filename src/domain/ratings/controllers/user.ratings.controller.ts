import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { CreateRatingDTO, ListRatingDTO } from '../dto';
import { RatingsService } from '../services';

@Controller('user/ratings')
@UseGuards(JwtAuthUserGuard)
export class UserRatingsController extends BaseController {
  constructor(private _ratingService: RatingsService) {
    super();
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() dto: CreateRatingDTO,
  ) {
    const rating = await this._ratingService.create(dto, user);
    this.responseCustom(response, rating);
  }

  @Get()
  public async myRatings(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Query() dto: ListRatingDTO,
  ) {
    dto.createdBy = user.id;
    const { items, total } = await this._ratingService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
