import { Controller, Get, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseController } from 'src/library';
import { CategoryService } from '../services';
import { Response } from 'express';
import { FilesService } from 'src/domain/files';

@Controller('categories')
export class CategoryController extends BaseController {
  constructor(
    private _categoryService: CategoryService,
    private _fileService: FilesService,
  ) {
    super();
  }
  @Get()
  public async list(@Res() response: Response) {
    const items = await this._categoryService.list();
    items.forEach((el) => {
      if (el.image) {
        el.image = this._fileService.getUrl(el.image);
      }
    });
    this.responseCustom(response, items, { total: items.length });
  }
}
