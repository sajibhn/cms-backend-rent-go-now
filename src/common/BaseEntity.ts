import {
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@Column({ name: 'created_by', nullable: true })
	createdBy: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@Column({ name: 'updated_by', nullable: true })
	updatedBy: string;

	@DeleteDateColumn({ name: 'deleted_at', nullable: true })
	deletedAt: Date;

	@Column({ name: 'deleted_by', nullable: true})
	deletedBy: string;
}
