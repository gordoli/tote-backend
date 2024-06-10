import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTablesPhase11717428593694 implements MigrationInterface {
    name = 'InitTablesPhase11717428593694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tote_collections" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "createdBy" integer, CONSTRAINT "PK_6b2ae7116855f79f50ecc54b037" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tote_feed_activities" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" character varying NOT NULL, "referenceId" integer NOT NULL, "title" character varying NOT NULL, "createdBy" integer, CONSTRAINT "PK_04247565fea3df9108643d3550a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_feed_activities_referenceId" ON "tote_feed_activities" ("referenceId") `);
        await queryRunner.query(`CREATE TABLE "tote_collection_feeds" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "feedType" character varying NOT NULL, "referenceId" integer NOT NULL, "createdBy" integer, "collectionId" integer, "feedId" integer, CONSTRAINT "PK_05e4e4eb09b3d85e5f2a344370c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_collection_feeds_referenceId" ON "tote_collection_feeds" ("referenceId") `);
        await queryRunner.query(`CREATE TABLE "tote_brands" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "cover" character varying, "logo" character varying, "website" character varying, "userId" integer, CONSTRAINT "PK_3a593fa023cfb73cec313e17ec3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tote_categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "image" character varying, CONSTRAINT "PK_98480cd6344646571b193402347" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tote_ratings" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "rate" smallint NOT NULL, "link" character varying NOT NULL, "image" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "brandId" integer, "categoryId" integer, "createdBy" integer, CONSTRAINT "PK_8b01df3e2d457a1da83c6e2fe48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tote_followers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "PK_f7efa6efa0571b5c90369d99e8a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_followers_user_follower" ON "tote_followers" ("userId", "followerId") `);
        await queryRunner.query(`ALTER TABLE "tote_collections" ADD CONSTRAINT "FK_2e2c0dece7684f21b2b65781ca8" FOREIGN KEY ("createdBy") REFERENCES "tote_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_feed_activities" ADD CONSTRAINT "FK_746d23502b60965428843c6f52b" FOREIGN KEY ("createdBy") REFERENCES "tote_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" ADD CONSTRAINT "FK_a38bc2799ae89c0c21566a8f71a" FOREIGN KEY ("createdBy") REFERENCES "tote_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" ADD CONSTRAINT "FK_1b874c20dc50a228270262df871" FOREIGN KEY ("collectionId") REFERENCES "tote_collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" ADD CONSTRAINT "FK_4995e09cc3c2cc60e09428bdff8" FOREIGN KEY ("feedId") REFERENCES "tote_feed_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_brands" ADD CONSTRAINT "FK_04d344fe5947e77631930bf623b" FOREIGN KEY ("userId") REFERENCES "tote_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" ADD CONSTRAINT "FK_f8fc2b0cb2b719c750bc6ef66e2" FOREIGN KEY ("brandId") REFERENCES "tote_brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" ADD CONSTRAINT "FK_08d20889e00c9cd2ad21832e51b" FOREIGN KEY ("categoryId") REFERENCES "tote_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" ADD CONSTRAINT "FK_c822e184b9923f8a4d9f99ed3e5" FOREIGN KEY ("createdBy") REFERENCES "tote_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tote_followers" ADD CONSTRAINT "FK_6e1b78ba5d5a0065c9bbb3f1134" FOREIGN KEY ("userId") REFERENCES "tote_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tote_followers" ADD CONSTRAINT "FK_dee5025220fa9bb2c33e2ec0d76" FOREIGN KEY ("followerId") REFERENCES "tote_users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tote_followers" DROP CONSTRAINT "FK_dee5025220fa9bb2c33e2ec0d76"`);
        await queryRunner.query(`ALTER TABLE "tote_followers" DROP CONSTRAINT "FK_6e1b78ba5d5a0065c9bbb3f1134"`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" DROP CONSTRAINT "FK_c822e184b9923f8a4d9f99ed3e5"`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" DROP CONSTRAINT "FK_08d20889e00c9cd2ad21832e51b"`);
        await queryRunner.query(`ALTER TABLE "tote_ratings" DROP CONSTRAINT "FK_f8fc2b0cb2b719c750bc6ef66e2"`);
        await queryRunner.query(`ALTER TABLE "tote_brands" DROP CONSTRAINT "FK_04d344fe5947e77631930bf623b"`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" DROP CONSTRAINT "FK_4995e09cc3c2cc60e09428bdff8"`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" DROP CONSTRAINT "FK_1b874c20dc50a228270262df871"`);
        await queryRunner.query(`ALTER TABLE "tote_collection_feeds" DROP CONSTRAINT "FK_a38bc2799ae89c0c21566a8f71a"`);
        await queryRunner.query(`ALTER TABLE "tote_feed_activities" DROP CONSTRAINT "FK_746d23502b60965428843c6f52b"`);
        await queryRunner.query(`ALTER TABLE "tote_collections" DROP CONSTRAINT "FK_2e2c0dece7684f21b2b65781ca8"`);
        await queryRunner.query(`DROP INDEX "public"."idx_followers_user_follower"`);
        await queryRunner.query(`DROP TABLE "tote_followers"`);
        await queryRunner.query(`DROP TABLE "tote_ratings"`);
        await queryRunner.query(`DROP TABLE "tote_categories"`);
        await queryRunner.query(`DROP TABLE "tote_brands"`);
        await queryRunner.query(`DROP INDEX "public"."idx_collection_feeds_referenceId"`);
        await queryRunner.query(`DROP TABLE "tote_collection_feeds"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feed_activities_referenceId"`);
        await queryRunner.query(`DROP TABLE "tote_feed_activities"`);
        await queryRunner.query(`DROP TABLE "tote_collections"`);
    }

}
