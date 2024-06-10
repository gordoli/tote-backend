import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/database';

@Injectable()
export class CategoryService {
  constructor(private _categoryRepository: CategoryRepository) {}

  public async list() {
    return this._categoryRepository.findBy({});
  }
}
