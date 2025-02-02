import { MigrationInterface, QueryRunner } from "typeorm";

export class  CreateStateTable1734946381427 implements MigrationInterface {
    name = 'CreateStateTable1734946381427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "name" character varying NOT NULL, "description" text, "location" geography(Point,4326), "url" character varying NOT NULL, CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5b0579f1057cf4363e116eec51" ON "state" USING GiST ("location") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5b0579f1057cf4363e116eec51"`);
        await queryRunner.query(`DROP TABLE "state"`);
    }

}
