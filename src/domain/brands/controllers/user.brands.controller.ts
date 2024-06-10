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
import { CurrentUser, JwtAuthUserGuard, Public } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { CreateBrandDTO, ListBrandDTO } from '../dto';
import { BrandsService } from '../services';

@Controller('user/brands')
@UseGuards(JwtAuthUserGuard)
export class UserBrandsController extends BaseController {
  constructor(private _brandService: BrandsService) {
    super();
  }

  @Post()
  public async create(
    @CurrentUser() user: User,
    @Body() dto: CreateBrandDTO,
    @Res() response: Response,
  ) {
    const brand = await this._brandService.create(dto, user);
    this.responseCustom(response, this._brandService.handleStoreFiles(brand));
  }

  @Get()
  @Public()
  public async list(@Res() response: Response, @Query() dto: ListBrandDTO) {
    const { items, total } = await this._brandService.list(dto);
    this.responseCustom(response, items, {
      total,
      page: dto.page,
      perPage: dto.perPage,
    });
  }
}
