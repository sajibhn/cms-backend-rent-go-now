import { MigrationInterface, QueryRunner } from "typeorm";

export class  CreateNeighborhoodTable1734958788552 implements MigrationInterface {
    name = 'CreateNeighborhoodTable1734958788552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "neighborhood" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "name" character varying NOT NULL, "description" text, "location" geography(Point,4326), "url" character varying NOT NULL, "cityId" uuid, CONSTRAINT "PK_97797961be30242a5170d17caec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "neighborhood" ADD CONSTRAINT "FK_1640abb7a428c88d65b1df610ef" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "neighborhood" DROP CONSTRAINT "FK_1640abb7a428c88d65b1df610ef"`);
        await queryRunner.query(`DROP TABLE "neighborhood"`);
    }

}
