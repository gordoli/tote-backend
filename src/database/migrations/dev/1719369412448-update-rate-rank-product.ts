import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRateRankProduct1719369412448 implements MigrationInterface {
  name = 'UpdateRateRankProduct1719369412448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "rate"`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "rate" numeric NOT NULL DEFAULT '10'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "rate"`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "rate" smallint NOT NULL`,
    );
  }
}
