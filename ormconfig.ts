import options from './dataSourceOptions';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: '.env' });
const { NODE_ENV = 'dev' } = process.env;
const pathMigrations = `/src/database/migrations/${NODE_ENV}/*.ts`;

console.log('path migration', pathMigrations);

export default new DataSource({
  ...options,
  migrations: [__dirname + pathMigrations],
  migrationsTableName: 'typeorm_migrations',
});
