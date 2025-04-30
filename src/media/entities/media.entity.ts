import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/BaseEntity';

export enum ImageParentType {
	STATE = 'state',
	CITY = 'city',
	NEIGHBORHOOD = 'neighborhood',
	APARTMENT = 'apartment',
	UNIT = 'unit',
}

@Entity()
export class Media extends BaseEntity {
	@Column({
		type: 'enum',
		enum: ImageParentType,
	})
	type: ImageParentType;

	@Column()
	typeId: string;

	@Column()
	imageUrl: string;
}
