import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5433,
	username: 'postgres',
	password: 'password',
	database: 'crm',
	entities: ['dist/**/*.entity.js'],
	synchronize: false,

}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;