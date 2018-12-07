import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Age {
	@PrimaryGeneratedColumn() id: number;
	@Column() name: string;
	@Column() code: string;
}
