import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTablesName1718596035633 implements MigrationInterface {
  name = 'UpdateTablesName1718596035633';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`,
    );
    await queryRunner.query(
      `CREATE TABLE "Feeds" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" character varying NOT NULL, "referenceId" integer NOT NULL, "title" character varying, "createdBy" integer, CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_feeds_referenceId" ON "Feeds" ("referenceId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "WishlistFeeds" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "feedType" character varying NOT NULL, "referenceId" integer NOT NULL, "createdBy" integer, "wishListId" integer, "feedId" integer, CONSTRAINT "PK_6c8648cdf1b8d81d0b5757662bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_wish_list_feeds_referenceId" ON "WishlistFeeds" ("referenceId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_wish_list_feeds_feed_wish_list" ON "WishlistFeeds" ("feedId", "wishListId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Wishlists" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "createdBy" integer, CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RankProducts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "rate" smallint NOT NULL, "link" character varying NOT NULL, "image" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "brandId" integer, "categoryId" integer, "createdBy" integer, CONSTRAINT "PK_49cb0f16aa22dc7554611c2c9d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" ADD CONSTRAINT "FK_747ab709765a3282d9af855a8cd" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" ADD CONSTRAINT "FK_606a5f8ab9f94e8a86244d75366" FOREIGN KEY ("wishListId") REFERENCES "Wishlists"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" ADD CONSTRAINT "FK_549417f7b0e827f0078bc6346c1" FOREIGN KEY ("feedId") REFERENCES "Feeds"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_4592664f6791688402abc2a4b76" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_3e1aa21b09896cec3165c133d17" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_61cd471ab9e60a09207e6608812" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_61cd471ab9e60a09207e6608812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_3e1aa21b09896cec3165c133d17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_4592664f6791688402abc2a4b76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" DROP CONSTRAINT "FK_549417f7b0e827f0078bc6346c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" DROP CONSTRAINT "FK_606a5f8ab9f94e8a86244d75366"`,
    );
    await queryRunner.query(
      `ALTER TABLE "WishlistFeeds" DROP CONSTRAINT "FK_747ab709765a3282d9af855a8cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "FK_d7cc6378cb63766a7383aaab601"`,
    );
    await queryRunner.query(`DROP TABLE "RankProducts"`);
    await queryRunner.query(`DROP TABLE "Wishlists"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_wish_list_feeds_feed_wish_list"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_wish_list_feeds_referenceId"`,
    );
    await queryRunner.query(`DROP TABLE "WishlistFeeds"`);
    await queryRunner.query(`DROP INDEX "public"."idx_feeds_referenceId"`);
    await queryRunner.query(`DROP TABLE "Feeds"`);
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
