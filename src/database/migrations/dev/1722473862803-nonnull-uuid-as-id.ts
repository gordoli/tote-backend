import { MigrationInterface, QueryRunner } from 'typeorm';

export class NonnullUUIDAsId1722473862803 implements MigrationInterface {
  name = 'NonnullUUIDAsId1722473862803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_61cd471ab9e60a09207e6608812" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP CONSTRAINT "PK_16d4f7d636df336db11d87413e3" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "PK_100d549ad83dafeecad2fd74570" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "PK_100d549ad83dafeecad2fd74570" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "Brands" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_3e1aa21b09896cec3165c133d17" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Categories" DROP CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Categories" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Categories" ADD CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "PK_49cb0f16aa22dc7554611c2c9d2" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "PK_49cb0f16aa22dc7554611c2c9d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "brandId"`);
    await queryRunner.query(`ALTER TABLE "RankProducts" ADD "brandId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" ADD "categoryId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "productId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Notifications" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP COLUMN "senderId"`,
    );
    await queryRunner.query(`ALTER TABLE "Notifications" ADD "senderId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP COLUMN "receiverId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD "receiverId" uuid`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_followers_user_follower"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "followerId"`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD "followerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_feeds_referenceId"`);
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "referenceId"`);
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD "referenceId" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "Feeds" ADD "createdBy" uuid`);
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "CustomLists" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "CustomLists" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "CustomLists" ADD "userId" uuid`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_followers_user_follower" ON "Followers" ("userId", "followerId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_feeds_referenceId" ON "Feeds" ("referenceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_3e1aa21b09896cec3165c133d17" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_61cd471ab9e60a09207e6608812" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_cccee741c1cf2e3dfe04a00b1f7" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "FK_c5e712db8e805ddfa0ba76bb1c4" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_90226d3531177129476a69788ec" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_61cd471ab9e60a09207e6608812" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_3e1aa21b09896cec3165c133d17" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935" cascade`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "FK_7c2944b1214827458523e9b60ac" cascade`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_feeds_referenceId"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_followers_user_follower"`,
    );
    await queryRunner.query(`ALTER TABLE "CustomLists" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "CustomLists" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "CustomLists" DROP CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "CustomLists" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "PK_0870a5174457194dea3ec4dcfa1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "createdBy"`);
    await queryRunner.query(`ALTER TABLE "Feeds" ADD "createdBy" integer`);
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "referenceId"`);
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD "referenceId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_feeds_referenceId" ON "Feeds" ("referenceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" DROP CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Feeds" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Feeds" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "PK_9ae0d0371cc4ec9bff560fedabf" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "followerId"`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD "followerId" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" DROP CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Followers" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Followers" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "PK_6d71b92abdd180a7d9859d75551" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_followers_user_follower" ON "Followers" ("userId", "followerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP COLUMN "receiverId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD "receiverId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP COLUMN "senderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD "senderId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" DROP CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Notifications" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "productId" integer`);
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" DROP CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Wishlists" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Wishlists" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "PK_21379dd460194cf2f2fccda8b2b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "createdBy" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "categoryId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "brandId"`);
    await queryRunner.query(`ALTER TABLE "RankProducts" ADD "brandId" integer`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" DROP CONSTRAINT "PK_49cb0f16aa22dc7554611c2c9d2" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "RankProducts" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "PK_49cb0f16aa22dc7554611c2c9d2" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_90226d3531177129476a69788ec" FOREIGN KEY ("productId") REFERENCES "RankProducts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Categories" DROP CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Categories" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "Categories" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Categories" ADD CONSTRAINT "PK_537b5c00afe7427c4fc9434cd59" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_3e1aa21b09896cec3165c133d17" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "Brands" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "Brands" DROP CONSTRAINT "PK_100d549ad83dafeecad2fd74570" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Brands" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Brands" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "PK_100d549ad83dafeecad2fd74570" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_03fb2d4de7ceab86b7963cfc935" FOREIGN KEY ("brandId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" DROP CONSTRAINT "PK_16d4f7d636df336db11d87413e3" cascade`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications" ADD CONSTRAINT "FK_1332fc4233d68bc3aae30d89ccd" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "CustomLists" ADD CONSTRAINT "FK_76b86007263e50c3c8ebaac8f10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Feeds" ADD CONSTRAINT "FK_d7cc6378cb63766a7383aaab601" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "RankProducts" ADD CONSTRAINT "FK_61cd471ab9e60a09207e6608812" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Wishlists" ADD CONSTRAINT "FK_9c416f3c2826e8ca9fc090ba065" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Brands" ADD CONSTRAINT "FK_7c2944b1214827458523e9b60ac" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Followers" ADD CONSTRAINT "FK_1cc0e60c868c76985e203eb521c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
