import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1717257077708 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tote_categories (name) VALUES ('Sneakers'),('T-Shirts'),('Tops'),('Shorts'),('Vests'),('Jackets'),('Jerseys'),('Jeans'),('Sweatshirts'),('Hoodies'),('Tracksuits');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM tote_categories WHERE name IN ('Sneakers','T-Shirts','Tops','Shorts','Vests','Jackets','Jerseys','Jeans','Sweatshirts','Hoodies','Tracksuits');`,
    );
  }
}
