import { MigrationInterface, QueryRunner } from "typeorm";

export class  CreateUnitTable1745161181933 implements MigrationInterface {
    name = 'CreateUnitTable1745161181933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "name" character varying NOT NULL, "bedrooms" integer NOT NULL, "bathrooms" integer NOT NULL, "floorArea" integer NOT NULL, "price" integer NOT NULL, "minLeaseMonths" integer NOT NULL, "minRentPeriod" integer NOT NULL, "contact" character varying NOT NULL, "amenities" character varying NOT NULL, "facilities" character varying NOT NULL, "isFullyFurnished" boolean NOT NULL, "description" text, "apartmentId" uuid, CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "unit" ADD CONSTRAINT "FK_6285614bf30816952432e6250af" FOREIGN KEY ("apartmentId") REFERENCES "apartment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "unit" DROP CONSTRAINT "FK_6285614bf30816952432e6250af"`);
        await queryRunner.query(`DROP TABLE "unit"`);
    }

}
