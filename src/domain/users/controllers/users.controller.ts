import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { CurrentUser } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { EditUserDto, SearchMembersDto } from '../dto';
import { UsersService } from '../services';
import { BrandsService, ListBrandDTO } from 'src/domain/brands';
import { ListProductDTO, ProductsService } from 'src/domain/products';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/database';

@ApiTags('Users')
@Controller('users')
// TODO: auth guard
export class UsersController extends BaseController {
  constructor(
    private _usersService: UsersService,
    private _brandsService: BrandsService,
    private _productsService: ProductsService,
  ) {
    super();
  }

  @Get('search')
  public async search(@Query() dto: SearchMembersDto) {
    const { items, total } = await this._usersService.searchMembers(dto);
    return items;
  }

  @Patch('edit')
  public async edit(@CurrentUser() user: User, @Body() dto: EditUserDto) {
    const updatedUser = await this._usersService.editUser(
      user,
      new EditUserDto(dto),
    );
    return updatedUser;
  }

  @Get(':userId')
  public async userFullInformation(
    @CurrentUser() currentUser: User,
    @Param('userId') userId: string,
  ) {
    const user = await this._usersService.userFullInformation(
      userId,
      currentUser,
    );
    return user;
  }

  @Get(':userId/brands')
  public async brandsByUser(
    @Param('userId') userId: string,
    @Query() dto: ListBrandDTO,
  ) {
    dto.userId = userId;
    const { items } = await this._brandsService.list(dto);
    return items;
  }

  @Get(':userId/products')
  public async productsByUser(
    @Param('userId') userId: string,
    @Query() dto: ListProductDTO,
  ) {
    const { items } = await this._productsService.listByUser(userId, dto);
    return items;
  }
}
