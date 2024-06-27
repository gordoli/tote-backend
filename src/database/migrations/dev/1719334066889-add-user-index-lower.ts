import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIndexLower1719334066889 implements MigrationInterface {
  name = 'AddUserIndexLower1719334066889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_lower_username" ON "Users" ("username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_lower_email" ON "Users" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_lower_email"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_lower_username"`);
  }
}
