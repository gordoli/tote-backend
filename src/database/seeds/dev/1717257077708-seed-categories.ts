import { DATABASE_CONSTANT } from '../../../constants/database.constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1717257077708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "${DATABASE_CONSTANT.TABLE_NAME.CATEGORY}" (name) VALUES ('Sneakers'),('T-Shirts'),('Tops'),('Shorts'),('Vests'),('Jackets'),('Jerseys'),('Jeans'),('Sweatshirts'),('Hoodies'),('Tracksuits');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "${DATABASE_CONSTANT.TABLE_NAME.CATEGORY}" WHERE name IN ('Sneakers','T-Shirts','Tops','Shorts','Vests','Jackets','Jerseys','Jeans','Sweatshirts','Hoodies','Tracksuits');`,
    );
  }
}
