import { BaseEntity } from "src/common/BaseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {

	@Column()
	first_name: string;

	@Column()
	last_name: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	otp: string;

	@Column({ default: false })
	isBanned: boolean;

}
