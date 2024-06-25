import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWishlistProductId1719342547866
  implements MigrationInterface
{
  name = 'UpdateWishlistProductId1719342547866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_59a0181becd9b7dce028b052eaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" RENAME COLUMN "rankProductId" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" RENAME COLUMN "productId" TO "rankProductId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_59a0181becd9b7dce028b052eaf" FOREIGN KEY ("rankProductId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
