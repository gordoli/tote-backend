import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWishlistTable1719339648820 implements MigrationInterface {
  name = 'UpdateWishlistTable1719339648820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_4592664f6791688402abc2a4b76"`,
    );
    await queryRunner.query(
      `CREATE TABLE "CustomLists" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD "rankProductId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_59a0181becd9b7dce028b052eaf" FOREIGN KEY ("rankProductId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "WishlistFeeds"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_59a0181becd9b7dce028b052eaf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP COLUMN "rankProductId"`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "createdBy" integer`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "CustomLists"`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_4592664f6791688402abc2a4b76" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "WishlistFeeds"`);
  }
}
