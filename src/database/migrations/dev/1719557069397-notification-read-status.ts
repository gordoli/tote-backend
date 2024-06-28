import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationReadStatus1719557069397 implements MigrationInterface {
    name = 'NotificationReadStatus1719557069397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications" ADD "readStatus" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications" DROP COLUMN "readStatus"`);
    }

}
