import {Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToOne} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Program {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category)
    category: Category;
}
