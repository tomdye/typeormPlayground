import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sex {
	@PrimaryGeneratedColumn() id: number;
	@Column() name: string;
	@Column() code: string;
}
