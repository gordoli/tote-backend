import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1722890333671 implements MigrationInterface {
  name = 'Init1722890333671';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "cover" character varying, "logo" character varying, "website" character varying, CONSTRAINT "PK_100d549ad83dafeecad2fd74570" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "description" text, "image" character varying, CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "rate" numeric NOT NULL DEFAULT '10', "link" character varying NOT NULL, "image" character varying NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "brandId" uuid, "categoryId" uuid, "createdBy" uuid, CONSTRAINT "PK_36a07cc432789830e7fb7b58a83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "username" character varying, "avatar" character varying, "email" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "deletedAt" TIMESTAMP, "status" character varying NOT NULL DEFAULT 'active', "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_lower_username" ON "Users" ("username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_username" ON "Users" ("username") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_lower_email" ON "Users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Users_email" ON "Users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Wishlists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" uuid, "productId" uuid, CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Feeds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "type" character varying NOT NULL, "title" character varying, "createdBy" uuid, CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Followers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" uuid NOT NULL, "followerId" uuid NOT NULL, CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_followers_user_follower" ON "Followers" ("userId", "followerId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "senderId" uuid, "receiverId" uuid, "type" character varying NOT NULL, "data" jsonb, "readStatus" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CustomLists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "name" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" ADD CONSTRAINT "FK_b091e9b9c5356946549bc4cc6ad" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" ADD CONSTRAINT "FK_85fdee89fa67fcdce66863def29" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" ADD CONSTRAINT "FK_ae45c09c1617086cde375e1eb0b" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_1cc0e60c868c76985e203eb521c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "FK_d7cc6378cb63766a7383aaab601"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" DROP CONSTRAINT "FK_ae45c09c1617086cde375e1eb0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" DROP CONSTRAINT "FK_85fdee89fa67fcdce66863def29"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Products" DROP CONSTRAINT "FK_b091e9b9c5356946549bc4cc6ad"`,
    );
    await queryRunner.query(`DROP TABLE "CustomLists"`);
    await queryRunner.query(`DROP TABLE "Notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_followers_user_follower"`,
    );
    await queryRunner.query(`DROP TABLE "Followers"`);
    await queryRunner.query(`DROP TABLE "Feeds"`);
    await queryRunner.query(`DROP TABLE "Wishlists"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_email"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_lower_email"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_username"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Users_lower_username"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "Products"`);
    await queryRunner.query(`DROP TABLE "Categories"`);
    await queryRunner.query(`DROP TABLE "Brands"`);
  }
}
