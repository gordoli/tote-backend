import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserTable1717044916561 implements MigrationInterface {
  name = 'InitUserTable1717044916561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tote_users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "username" character varying, "avatar" character varying, "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "password" character varying, "refreshToken" character varying, "deletedAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'active', "isVerified" boolean NOT NULL DEFAULT false, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, CONSTRAINT "PK_a116a4928ca1f27416c0ede08f6" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tote_users"`);
  }
}
