import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from 'src/library';
import { SearchMembersDto } from '../dto';
import { UsersService } from '../services';

@Controller('searchMembers')
export class SearchMembersController extends BaseController {
  constructor(private _usersService: UsersService) {
    super();
  }

  @Get()
  public async searchMembers(
    @Res() response: Response,
    @Query() dto: SearchMembersDto,
  ) {
    const { items, total } = await this._usersService.searchMembers(dto);
    this.responseCustom(response, items, { total });
  }
}
