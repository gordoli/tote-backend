import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase1Tables1717681626850 implements MigrationInterface {
  name = 'Phase1Tables1717681626850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "username" character varying, "avatar" character varying, "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "password" character varying, "refreshToken" character varying, "deletedAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'active', "isVerified" boolean NOT NULL DEFAULT false, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Followers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer NOT NULL, "followerId" integer NOT NULL, CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_followers_user_follower" ON "Followers" ("userId", "followerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Brands" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "cover" character varying, "logo" character varying, "website" character varying, "userId" integer, CONSTRAINT "PK_100d549ad83dafeecad2fd74570" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "image" character varying, CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Ratings" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "rate" smallint NOT NULL, "link" character varying NOT NULL, "image" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "brandId" integer, "categoryId" integer, "createdBy" integer, CONSTRAINT "PK_ee6436ff188c9bb00cc70fc447a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "FeedActivities" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" character varying NOT NULL, "referenceId" integer NOT NULL, "title" character varying, "createdBy" integer, CONSTRAINT "PK_b3cf4ab1fc74b78201ed7d91a96" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_feed_activities_referenceId" ON "FeedActivities" ("referenceId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "CollectionFeeds" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "feedType" character varying NOT NULL, "referenceId" integer NOT NULL, "createdBy" integer, "collectionId" integer, "feedId" integer, CONSTRAINT "PK_5f0e881ea855990a6b1a4f3fbf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_collection_feeds_referenceId" ON "CollectionFeeds" ("referenceId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_collection_feeds_feed_collection" ON "CollectionFeeds" ("feedId", "collectionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Collections" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "createdBy" integer, CONSTRAINT "PK_d26a225e716bb5c7c28c7425291" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" ADD CONSTRAINT "FK_e3440993de42a68c83f6e94d5b5" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" ADD CONSTRAINT "FK_561947f827d3b1fc78d1702611f" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" ADD CONSTRAINT "FK_a6d70cba433e53e91b29ca6b27e" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "FeedActivities" ADD CONSTRAINT "FK_5cb6d7c1ef3eef32a693f62d178" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" ADD CONSTRAINT "FK_6fcc452a82334ddf8c564449b2d" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" ADD CONSTRAINT "FK_3048b97b3c6c73f25db09b47b5f" FOREIGN KEY ("collectionId") REFERENCES "Collections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" ADD CONSTRAINT "FK_9b9d182703e9136feb014335bef" FOREIGN KEY ("feedId") REFERENCES "FeedActivities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Collections" ADD CONSTRAINT "FK_9d5c8b00845e0fb3fe132537ee3" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Collections" DROP CONSTRAINT "FK_9d5c8b00845e0fb3fe132537ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT "FK_9b9d182703e9136feb014335bef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT "FK_3048b97b3c6c73f25db09b47b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT "FK_6fcc452a82334ddf8c564449b2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FeedActivities" DROP CONSTRAINT "FK_5cb6d7c1ef3eef32a693f62d178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT "FK_a6d70cba433e53e91b29ca6b27e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT "FK_561947f827d3b1fc78d1702611f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT "FK_e3440993de42a68c83f6e94d5b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_1cc0e60c868c76985e203eb521c"`,
    );
    await queryRunner.query(`DROP TABLE "Collections"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_collection_feeds_feed_collection"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_collection_feeds_referenceId"`,
    );
    await queryRunner.query(`DROP TABLE "CollectionFeeds"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_feed_activities_referenceId"`,
    );
    await queryRunner.query(`DROP TABLE "FeedActivities"`);
    await queryRunner.query(`DROP TABLE "Ratings"`);
    await queryRunner.query(`DROP TABLE "Categories"`);
    await queryRunner.query(`DROP TABLE "Brands"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_followers_user_follower"`,
    );
    await queryRunner.query(`DROP TABLE "Followers"`);
    await queryRunner.query(`DROP TABLE "Users"`);
  }
}
