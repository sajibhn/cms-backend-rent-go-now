import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

const getEnvFilePath = () => {
  switch (process.env.NODE_ENV) {
    case 'dev_local':
      return process.cwd() + '/.env';
    case 'test':
      return process.cwd() + '/.env.test';
    default:
      return null;
  }
};

dotenv.config({
  path: getEnvFilePath(),
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migration/*.js'],
  synchronize: false,

}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;