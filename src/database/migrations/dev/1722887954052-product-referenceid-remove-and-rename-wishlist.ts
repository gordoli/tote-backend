import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductReferenceIdRemoveAndRenameWishlist1722887954052 implements MigrationInterface {
    name = 'ProductReferenceIdRemoveAndRenameWishlist1722887954052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "id"`);
        await queryRunner.query(`ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec"`);
        await queryRunner.query(`DROP INDEX "public"."idx_feeds_referenceId"`);
        await queryRunner.query(`CREATE TABLE "Products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "rate" numeric NOT NULL DEFAULT '10', "link" character varying NOT NULL, "image" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "brandId" uuid, "categoryId" uuid, "createdBy" uuid, CONSTRAINT "PK_36a07cc432789830e7fb7b58a83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "referenceId"`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "FK_b091e9b9c5356946549bc4cc6ad" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "FK_85fdee89fa67fcdce66863def29" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Products" ADD CONSTRAINT "FK_ae45c09c1617086cde375e1eb0b" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec"`);
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "FK_ae45c09c1617086cde375e1eb0b"`);
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "FK_85fdee89fa67fcdce66863def29"`);
        await queryRunner.query(`ALTER TABLE "Products" DROP CONSTRAINT "FK_b091e9b9c5356946549bc4cc6ad"`);
        await queryRunner.query(`ALTER TABLE "Feeds" ADD "referenceId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Brands" ADD "userId" uuid`);
        await queryRunner.query(`DROP TABLE "Products"`);
        await queryRunner.query(`CREATE INDEX "idx_feeds_referenceId" ON "Feeds" ("referenceId") `);
        await queryRunner.query(`ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "id" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
