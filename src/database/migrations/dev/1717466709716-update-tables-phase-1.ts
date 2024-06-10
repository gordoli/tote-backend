import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTablesPhase11717466709716 implements MigrationInterface {
    name = 'UpdateTablesPhase11717466709716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tote_feed_activities" ALTER COLUMN "title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tote_feed_activities" ALTER COLUMN "title" SET NOT NULL`);
    }

}
