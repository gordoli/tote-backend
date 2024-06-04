import options from './dataSourceOptions';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: '.env' });
const { NODE_ENV = 'dev' } = process.env;
const pathSeeds = `/src/database/seeds/${NODE_ENV}/*.ts`;

console.log('path seeds', pathSeeds);

export default new DataSource({
  ...options,
  migrations: [__dirname + pathSeeds],
  migrationsTableName: 'typeorm_seeds',
});
