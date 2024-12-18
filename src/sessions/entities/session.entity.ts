import { BaseEntity } from "src/common/BaseEntity";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Session extends BaseEntity {
	@Column()
	session: string;

	@Column({ type: 'timestamp' })
	lastActivity: Date;

	@ManyToOne(() => Users)
	@JoinColumn({ name: 'userId' })
	user: Users
}
