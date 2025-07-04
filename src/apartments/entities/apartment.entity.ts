import { Point } from "geojson";
import { BaseEntity } from "src/common/BaseEntity";
import { Neighborhood } from "src/neighborhood/entities/neighborhood.entity";
import { Unit } from "src/units/entities/unit.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Apartment extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

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

  @ManyToOne(() => Neighborhood, neighborhood => neighborhood.apartment)
  @JoinColumn([{ referencedColumnName: 'id' }])
  neighborhood: Neighborhood;

  @OneToMany(() => Unit, unit => unit.apartment)
  units: Unit[];

}
