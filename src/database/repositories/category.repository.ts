import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(_dataSource: DataSource) {
    super(Category, _dataSource);
  }
}
