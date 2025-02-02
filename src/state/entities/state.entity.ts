import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { Point } from 'geojson';
import { City } from "src/city/entities/city.entity";

@Entity()
export class State extends BaseEntity {

	@Column()
	name: string;

	@Column({type: 'text', nullable: true})
	description: string;

	@Index({ spatial: true })
	@Column({
		type: 'geography',
		spatialFeatureType: 'Point',
		srid: 4326,
		nullable: true,
	})
	location: Point

	@Column()
	url: string;

	@OneToMany(() => City, city => city.state)
	city: City[];
}
