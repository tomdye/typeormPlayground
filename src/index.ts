import "reflect-metadata";
import {createConnection} from "typeorm";
import {Building} from "./entity/Building";
import { Age } from "./entity/Age";
import { Sex } from "./entity/Sex";

createConnection().then(async connection => {

	console.log("Inserting a new building into the database...");
	const adultAge = new Age();
	adultAge.code = 'ADULT';
	adultAge.name = 'adult';

	const juvAge = new Age();
	juvAge.code = 'JUVENILE';
	juvAge.name = 'juvenile';

	const maleSex = new Sex();
	maleSex.code = 'MALE';
	maleSex.name = 'male';

	const femaleSex = new Sex();
	femaleSex.code = 'FEMALE';
	femaleSex.name = 'female';

	await connection.manager.save(adultAge);
	await connection.manager.save(juvAge);
	await connection.manager.save(maleSex);
	await connection.manager.save(femaleSex);

	const buildingsToCreate: { name: string; ages: Age[], sexes: Sex[];}[] = [
		{ name: 'male, adult 1', ages: [adultAge], sexes: [maleSex] },
		{ name: 'male, adult 2', ages: [adultAge], sexes: [maleSex] },
		{ name: 'male, juv 1', ages: [juvAge], sexes: [maleSex] },
		{ name: 'male, juv 2', ages: [juvAge], sexes: [maleSex] },
		{ name: 'female, adult 1', ages: [adultAge], sexes: [femaleSex] },
		{ name: 'female, adult 2', ages: [adultAge], sexes: [femaleSex] },
		{ name: 'female, juv 1', ages: [juvAge], sexes: [femaleSex] },
		{ name: 'female, juv 2', ages: [juvAge], sexes: [femaleSex] },
		{ name: 'mixed sex, adult 1', ages: [adultAge], sexes: [femaleSex, maleSex] },
		{ name: 'mixed sex, adult 2', ages: [adultAge], sexes: [femaleSex, maleSex] },
		{ name: 'mixed sex, mixed age 1', ages: [adultAge, juvAge], sexes: [femaleSex, maleSex] },
		{ name: 'mixed sex, mixed age 2', ages: [adultAge, juvAge], sexes: [femaleSex, maleSex] }
	]

	const buildingCreatePromises = buildingsToCreate.map(({ name, ages, sexes }) => {
		const building = new Building();
		building.name = name;
		building.ages = ages;
		building.sexes = sexes;

		return connection.manager.save(building);
	});

	await Promise.all(buildingCreatePromises);

	console.log("Loading buildings from the database...\n");

	const buildings = await connection.manager.getRepository(Building).createQueryBuilder('building')
		.innerJoin('building.ages', 'ageCheck', 'ageCheck.code = :ageCode', { ageCode: 'ADULT' })
		.innerJoin('building.sexes', 'sexCheck', 'sexCheck.code = :sexCode', { sexCode: 'MALE' })
		.innerJoinAndSelect('building.ages', 'age')
		.innerJoinAndSelect('building.sexes', 'sex')
		.getMany();

	buildings.forEach(building => {
		console.log(`** ${building.name} - ${building.sexes.map(sex => sex.name)} - ${building.ages.map(age => age.name)}`);
	})
	console.log(`query returned ${buildings.length} rows`);

	connection.close();
}).catch(error => console.log(error));
