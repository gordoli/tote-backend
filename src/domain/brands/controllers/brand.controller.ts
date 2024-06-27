import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/database';
import { CurrentUser, JwtAuthUserGuard } from 'src/domain/auth';
import { BaseController } from 'src/library';
import { BrandsService } from '../services';

@Controller('brand')
@UseGuards(JwtAuthUserGuard)
export class BrandController extends BaseController {
  constructor(private _brandService: BrandsService) {
    super();
  }

  @Get(':id')
  public async detail(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Res() response: Response,
  ) {
    const brand = await this._brandService.detailById(id, user);
    this.responseCustom(response, brand);
  }
}
