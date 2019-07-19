import "reflect-metadata";
import {createConnection} from "typeorm";
import {Program} from "./entity/Program";
import {Category} from "./entity/Category";

createConnection().then(async connection => {

	const parent = new Category();
	parent.id = 1;
	parent.name = 'parent';

	const child1 = new Category();
	child1.id = 2;
	child1.name = 'child 1';
	child1.parent = parent;

	const child2 = new Category();
	child2.id = 3;
	child2.name = 'child 2';
	child2.parent = parent;

	const parentProgram = new Program();
	parentProgram.name = 'parent program';
	parentProgram.category = parent;

	const child1Program = new Program();
	child1Program.name = 'child1 program';
	child1Program.category = child1;

	const child2Program = new Program();
	child2Program.name = 'child2 program';
	child2Program.category = child2;

	await connection.manager.save(parent);
	await connection.manager.save(child1);
	await connection.manager.save(child2);
	await connection.manager.save(parentProgram);
	await connection.manager.save(child1Program);
	await connection.manager.save(child2Program);

	const qb = await connection.manager.getRepository(Program).createQueryBuilder('program')


	// select * from program program where program.categoryid IN (select id from category category where category.parentid = 1) or program.categoryid = 1

	const programs = await qb
			.where("program.category IN " + qb.subQuery().select("category.id").from(Category, "category").where("category.parentId = :categoryId").getQuery())
			.orWhere('program.category = :categoryId')
            .setParameter("categoryId", 1)
            .getMany();

	// const programs = await qb
	// 	.select('id')
	// 	.from(Category, 'category')
	// 	.where('category.parent = :parentId', { parentId: 1})
	// 	.getMany();
	// .where('program.category = :categoryId', { categoryId: 1 })
	// 	.leftJoinAndMapMany('program.category', 'children', 'childCategories', 'category.id = program.category')
	// 	.orWhere('program.category IN (:...childCategories)')
	// 	// .leftJoinAndSelect('program', 'program', 'program.category IN (...childCategories')
	// 	.getMany();

	// const program = await connection.manager.getRepository(Program).findOne({

	// 	join: {
	// 		alias: 'enrollment',
	// 		leftJoinAndSelect: {
	// 			status: 'enrollment.status'
	// 		}
	// 	}
	// })

	console.log('\n\n');
	console.log(JSON.stringify(programs));
	console.log('\n\n');

	connection.close();
}).catch(error => console.log(error));
