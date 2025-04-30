import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaTable1745222862209 implements MigrationInterface {
  name = 'CreateMediaTable1745222862209'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."media_type_enum" AS ENUM('state', 'city', 'neighborhood', 'apartment', 'unit')`);
    await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "type" "public"."media_type_enum" NOT NULL, "typeId" character varying NOT NULL, "imageUrl" character varying NOT NULL, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
  }

}
