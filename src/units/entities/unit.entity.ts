import { Apartment } from "src/apartments/entities/apartment.entity";
import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Unit extends BaseEntity {
	@Column()
	name: string;

	@Column()
	bedrooms: number;

	@Column()
	bathrooms: number;

	@Column()
	floorArea: number;

  @Column()
  price: number;

	@Column()
	minLeaseMonths: number;

	@Column()
	minRentPeriod: number;

	@Column()
	contact: string;

	@Column()
  amenities: string;

	@Column()
  facilities: string;

	@Column()
	isFullyFurnished: boolean;

	@Column({ type: 'text', nullable: true })
	description: string;

	@ManyToOne(() => Apartment, apartment => apartment.units)
	@JoinColumn([{ referencedColumnName: 'id' }])
	apartment: Apartment;

}
