import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { BaseController } from 'src/library';
import { CategoryService } from '../services';

@Controller('categories')
export class CategoryController extends BaseController {
  constructor(private _categoryService: CategoryService) {
    super();
  }
  @Get()
  public async list(@Res() response: Response) {
    const items = await this._categoryService.list();
    this.responseCustom(response, items, { total: items.length });
  }
}
