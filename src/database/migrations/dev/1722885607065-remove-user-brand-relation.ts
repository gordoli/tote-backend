import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUserBrandRelation1722885607065
  implements MigrationInterface
{
  name = 'RemoveUserBrandRelation1722885607065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "id"`);
    await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "userId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Brands" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "id" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
