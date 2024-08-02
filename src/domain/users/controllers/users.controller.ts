import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { EditUserDto, SearchMembersDto } from '../dto';
import { UsersService } from '../services';
import { User } from 'src/database';
import { BrandsService, ListBrandDTO } from 'src/domain/brands';
import {
  ListRankProductDTO,
  RankProductsService,
} from 'src/domain/rank-products';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
// TODO: auth guard
export class UsersController extends BaseController {
  constructor(
    private _usersService: UsersService,
    private _brandsService: BrandsService,
    private _rankProductsService: RankProductsService,
  ) {
    super();
  }

  @Get('search')
  public async search(
    @Query() dto: SearchMembersDto,
    @Res() response: Response,
  ) {
    const { items, total } = await this._usersService.searchMembers(dto);
    return this.responseCustom(response, items, { total });
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
    @CurrentUser() currentUser: User,
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    const user = await this._usersService.userFullInformation(
      userId,
      currentUser,
    );
    return this.responseCustom(response, user);
  }

  @Get(':userId/brands')
  public async brandsByUser(
    @Param('userId') userId: string,
    @Query() dto: ListBrandDTO,
    @Res() response: Response,
  ) {
    dto.userId = userId;
    const { items, total } = await this._brandsService.list(dto);
    return this.responseCustom(response, items, { total });
  }

  @Get(':userId/products')
  public async rankProductsByUser(
    @Param('userId') userId: string,
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
