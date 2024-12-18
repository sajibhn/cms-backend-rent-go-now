import { BaseEntity } from "src/common/BaseEntity";
import { Session } from "src/sessions/entities/session.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Users extends BaseEntity {

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	otp: string;

	@Column({ default: false })
	isBanned: boolean;


	@OneToMany(() => Session, (session) => session.user)
	@JoinColumn([{ referencedColumnName: 'id' }])
	sessions: Session[];
}
