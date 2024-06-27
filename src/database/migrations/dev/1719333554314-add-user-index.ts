import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIndex1719333554314 implements MigrationInterface {
  name = 'AddUserIndex1719333554314';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_username" ON "Users" ("username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_email" ON "Users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_email"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_username"`);
  }
}
