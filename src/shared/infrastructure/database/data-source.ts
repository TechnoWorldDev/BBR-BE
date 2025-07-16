// TypeORM CLI Migrations
import { DataSource } from 'typeorm';

const dbType = process.env.DB_TYPE;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

if (!dbType || !host || !port || !username || !password || !database) {
  throw new Error('Missing required database configuration in the specified .env file');
}

export const AppDataSource = new DataSource({
  type: dbType as 'postgres',
  host,
  port: parseInt(port, 10),
  username,
  password,
  database,
  migrations: ['db/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
