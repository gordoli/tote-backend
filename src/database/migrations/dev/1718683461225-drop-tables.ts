import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTables1718683461225 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Collections" DROP CONSTRAINT IF EXISTS "FK_9d5c8b00845e0fb3fe132537ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_9b9d182703e9136feb014335bef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_3048b97b3c6c73f25db09b47b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_6fcc452a82334ddf8c564449b2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FeedActivities" DROP CONSTRAINT IF EXISTS "FK_5cb6d7c1ef3eef32a693f62d178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_a6d70cba433e53e91b29ca6b27e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_561947f827d3b1fc78d1702611f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_e3440993de42a68c83f6e94d5b5"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "Collections"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_collection_feeds_feed_collection"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_collection_feeds_referenceId"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "CollectionFeeds"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_feed_activities_referenceId"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "FeedActivities"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "Ratings"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Collections" DROP CONSTRAINT IF EXISTS "FK_9d5c8b00845e0fb3fe132537ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_9b9d182703e9136feb014335bef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_3048b97b3c6c73f25db09b47b5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CollectionFeeds" DROP CONSTRAINT IF EXISTS "FK_6fcc452a82334ddf8c564449b2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "FeedActivities" DROP CONSTRAINT IF EXISTS "FK_5cb6d7c1ef3eef32a693f62d178"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_a6d70cba433e53e91b29ca6b27e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_561947f827d3b1fc78d1702611f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Ratings" DROP CONSTRAINT IF EXISTS "FK_e3440993de42a68c83f6e94d5b5"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "Collections"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_collection_feeds_feed_collection"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_collection_feeds_referenceId"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "CollectionFeeds"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."idx_feed_activities_referenceId"`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "FeedActivities"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "Ratings"`);
  }
}
