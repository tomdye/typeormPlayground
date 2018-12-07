import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { Age } from "./Age";
import { Sex } from "./Sex";

@Entity()
export class Building {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Age)
	@JoinTable({ name: 'building_ages_building_age' })
	ages?: Age[];

	@ManyToMany(() => Sex)
	@JoinTable({ name: 'building_sexes_building_sex' })
	sexes?: Sex[];

}
