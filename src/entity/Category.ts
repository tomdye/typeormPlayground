import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Program } from './Program';

@Entity()
export class Category {
	@PrimaryGeneratedColumn() id: number;

	@Column()
	name: string;

	@ManyToOne(() => Category)
	parent: Category;

	@OneToMany(() => Category, category => category.parent)
	children: Category[];
}
