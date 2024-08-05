import { Controller, Get, Res } from '@nestjs/common';
import { BaseController } from 'src/library';
import { CategoryService } from '../services';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController extends BaseController {
  constructor(private _categoryService: CategoryService) {
    super();
  }
  @Get()
  public async list() {
    const items = await this._categoryService.list();
    return items;
  }
}
