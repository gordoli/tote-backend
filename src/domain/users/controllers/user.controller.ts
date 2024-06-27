import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BrandsService, ListBrandDTO } from 'src/domain/brands';
import {
  ListRankProductDTO,
  RankProductsService,
} from 'src/domain/rank-products';
import { BaseController } from 'src/library';
import { EditUserDto } from '../dto';
import { UsersService } from '../services';

@Controller('user')
@UseGuards(JwtAuthUserGuard)
export class UserController extends BaseController {
  constructor(
    private _usersService: UsersService,
    private _brandsService: BrandsService,
    private _rankProductsService: RankProductsService,
  ) {
    super();
  }

  @Patch('edit')
  public async edit(
    @CurrentUser() user: User,
    @Body() dto: EditUserDto,
    @Res() response: Response,
  ) {
    const updatedUser = await this._usersService.editUser(
      user,
      new EditUserDto(dto),
    );
    return this.responseCustom(response, updatedUser);
  }

  @Get(':userId')
  public async userFullInformation(
    @Param('userId') userId: number,
    @Res() response: Response,
  ) {
    const user = await this._usersService.userFullInformation(userId);
    return this.responseCustom(response, user);
  }

  @Get(':userId/brands')
  public async brandsByUser(
    @Param('userId') userId: number,
    @Query() dto: ListBrandDTO,
    @Res() response: Response,
  ) {
    dto.userId = userId;
    const { items, total } = await this._brandsService.list(dto);
    return this.responseCustom(response, items, { total });
  }

  @Get(':userId/products')
  public async rankProductsByUser(
    @Param('userId') userId: number,
    @Query() dto: ListRankProductDTO,
    @Res() response: Response,
  ) {
    const { items, total } = await this._rankProductsService.listByUser(
      userId,
      dto,
    );
    return this.responseCustom(response, items, { total });
  }
}
