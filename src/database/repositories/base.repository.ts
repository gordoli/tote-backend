import { BaseFilter } from 'src/library';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Follower } from '../entities';

class Filterable {
  public static buildQuery<T>(
    Class: Class,
    queryBuilder: SelectQueryBuilder<T>,
    { filter = {}, page, perPage }: BaseFilter,
  ): SelectQueryBuilder<T> {
    const instance = new Class({});
    Object.entries(filter).forEach(([property, value]) => {
      if (instance.hasOwnProperty(property) && value) {
        queryBuilder.andWhere({
          [property]: value,
        });
      }
    });
    if (page) {
      queryBuilder.skip(BaseFilter.getSkip(page, perPage));
    }
    if (perPage) {
      queryBuilder.take(BaseFilter.getTake(perPage));
    }
    return queryBuilder;
  }
}

export abstract class BaseRepository<T> extends Repository<T> {
  private _target: Class;

  constructor(target: Class, private _baseDataSource: DataSource) {
    super(target, _baseDataSource.createEntityManager());
    this._target = target;
  }

  protected _buildQuery(
    query: BaseFilter,
    queryBuilder?: SelectQueryBuilder<T>,
  ): SelectQueryBuilder<T> {
    if (queryBuilder) {
      return Filterable.buildQuery(this._target, queryBuilder, query);
    }
    const newQueryBuilder = this.createQueryBuilder();
    return Filterable.buildQuery(this._target, newQueryBuilder, query);
  }

  protected async _executeTransaction<T>(
    fn: (queryRunner: QueryRunner) => Promise<T>,
  ) {
    const queryRunner = this._baseDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await fn(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  protected _getTxRepository<T>(
    queryRunner: QueryRunner,
    target: EntityTarget<T>,
  ): Repository<T> {
    return queryRunner.manager.getRepository(target);
  }

  protected _getRepository<T>(target: EntityTarget<T>): Repository<T> {
    return this._baseDataSource.getRepository(target);
  }

  public async findOneOrCreate(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ) {
    const existedData = await this.findOneBy(where);
    if (existedData) {
      return existedData;
    }
    return this.save(data);
  }

  protected _friendOnly<T>(
    queryBuilder: SelectQueryBuilder<T>,
    columnAlias: string,
    userId: string,
  ) {
    return queryBuilder.innerJoin(
      Follower,
      'follower',
      `follower.follower = ${userId} AND follower.user = ${columnAlias}`,
    );
  }
}
