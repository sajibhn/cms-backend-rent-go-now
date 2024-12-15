import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class Users extends BaseEntity {

	@Column({name: 'first_name'})
	firstName: string;

	@Column({name: 'last_name'})
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	otp: string;

	@Column({ default: false })
	isBanned: boolean;

}
