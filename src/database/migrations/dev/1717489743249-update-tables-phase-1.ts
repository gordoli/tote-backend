import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTablesPhase11717489743249 implements MigrationInterface {
  name = 'UpdateTablesPhase11717489743249';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_collection_feeds_feed_collection" ON "tote_collection_feeds" ("feedId", "collectionId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."idx_collection_feeds_feed_collection"`,
    );
  }
}
