import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableNotification1719499114676 implements MigrationInterface {
    name = 'AddTableNotification1719499114676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "senderId" integer, "receiverId" integer, "type" character varying NOT NULL, "data" jsonb, CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Notifications" ADD CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Notifications" ADD CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications" DROP CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4"`);
        await queryRunner.query(`ALTER TABLE "Notifications" DROP CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd"`);
        await queryRunner.query(`DROP TABLE "Notifications"`);
    }

}
