import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { State } from "src/state/entities/state.entity";
import { Point } from 'geojson';
import { Neighborhood } from "src/neighborhood/entities/neighborhood.entity";

@Entity()
export class City extends BaseEntity {

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

	@ManyToOne(() => State, state => state.city)
	@JoinColumn([{ referencedColumnName: 'id' }])
	state: State;

	@OneToMany(() => Neighborhood, neighborhood => neighborhood.city)
	neighborhood: Neighborhood[];
}
