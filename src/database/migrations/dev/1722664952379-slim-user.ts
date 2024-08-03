import { MigrationInterface, QueryRunner } from "typeorm";

export class SlimUser1722664952379 implements MigrationInterface {
    name = 'SlimUser1722664952379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "provider"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "socialId"`);
        await queryRunner.query(`ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "socialId" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "provider" character varying NOT NULL DEFAULT 'email'`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "refreshToken" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
