import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApartmentTable1740828138411 implements MigrationInterface {
  name = 'CreateApartmentTable1740828138411'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "apartment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "name" character varying NOT NULL, "address" character varying NOT NULL, "description" text, "location" geography(Point,4326), "url" character varying NOT NULL, "neighborhoodId" uuid, CONSTRAINT "PK_c3d874d9924f6f16223162b3d3a" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "apartment" ADD CONSTRAINT "FK_8c78c355ed6f928adddee3c13e3" FOREIGN KEY ("neighborhoodId") REFERENCES "neighborhood"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "apartment" DROP CONSTRAINT "FK_8c78c355ed6f928adddee3c13e3"`);
    await queryRunner.query(`DROP TABLE "apartment"`);
  }

}
