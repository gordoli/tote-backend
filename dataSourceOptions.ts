import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
config({ path: '.env' });
const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DB } = process.env;

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: PG_HOST,
  port: +PG_PORT,
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  entities: [__dirname + '/../**/*.entity.js'],
  entityPrefix: 'tote_',
  logging: true,
  migrationsTransactionMode: 'all',
};

export default dataSourceOptions;
