import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';

import { BaseController } from 'src/library';
import { CreateBrandDTO, ListBrandDTO } from '../dto';
import { BrandsService } from '../services';
import { CurrentUser } from 'src/domain/auth';
import { User } from 'src/database';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brands')
// TODO: AuthGuard
export class BrandsController extends BaseController {
  constructor(private _brandService: BrandsService) {
    super();
  }

  @Get()
  public async list(@Query() dto: ListBrandDTO) {
    const { items } = await this._brandService.list(dto);
    items;
  }

  @Get(':id')
  public async detail(@CurrentUser() user: User, @Param('id') id: string) {
    const brand = await this._brandService.detailById(id, user);
    return brand;
  }
}
