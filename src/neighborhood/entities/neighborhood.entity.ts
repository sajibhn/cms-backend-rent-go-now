import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Point } from 'geojson';
import { City } from "src/city/entities/city.entity";

@Entity()
export class Neighborhood extends BaseEntity {

	@Column()
	name: string;

	@Column({ type: 'text', nullable: true })
	description: string;

	@Column({
		type: 'geography',
		spatialFeatureType: 'Point',
		srid: 4326,
		nullable: true,
	})
	location: Point;

	@Column()
	url: string;

	@ManyToOne(() => City, city => city.neighborhood)
	@JoinColumn([{ referencedColumnName: 'id' }])
	city: City;
}
