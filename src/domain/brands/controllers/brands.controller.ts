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
import { BaseController } from 'src/library';
import { CreateBrandDTO, ListBrandDTO } from '../dto';
import { BrandsService } from '../services';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { User } from 'src/database';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brands')
@UseGuards(JwtAuthUserGuard)
export class BrandsController extends BaseController {
  constructor(private _brandService: BrandsService) {
    super();
  }

  @Get()
  public async list(@Res() response: Response, @Query() dto: ListBrandDTO) {
    const { items, total } = await this._brandService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }

  @Get(':id')
  public async detail(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    const brand = await this._brandService.detailById(id, user);
    this.responseCustom(response, brand);
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() dto: CreateBrandDTO,
    @Res() response: Response,
  ) {
    const brand = await this._brandService.create(dto, user);
    this.responseCustom(response, brand);
  }
}
