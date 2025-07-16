import * as dotenv from 'dotenv';
import * as path from 'path';
import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

dotenv.config();

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // ssl: { rejectUnauthorized: false }, // use only for remote prod db connection
    },
    migrations: {
      directory: path.resolve(__dirname, 'db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, 'db/seeds'),
    },
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers(),
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: path.resolve(__dirname, 'db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, 'db/seeds'),
    },
    pool: {
      min: 2,
      max: 10,
    },
    ...knexSnakeCaseMappers(),
  },
};

export default knexConfig;
