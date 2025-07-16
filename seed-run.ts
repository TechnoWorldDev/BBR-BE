import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import Knex from 'knex';
import knexConfig from './knexfile';
import inquirer from 'inquirer';

dotenv.config();
const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[env]);
const seedsDir = knexConfig[env].seeds?.directory;

const startTime = Date.now();
if (!seedsDir || typeof seedsDir !== 'string') {
  console.error('Seeds directory is not defined in knex configuration.');
  process.exit(1);
}

fs.readdir(seedsDir, (err, files) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  inquirer
    .prompt([{ type: 'list', name: 'file', message: 'Select seed file', choices: files }])
    .then(({ file }) => {
      const seedPath = path.join(seedsDir, file);
      import(seedPath)
        .then((module) => {
          const seed = module.seed;
          if (typeof seed !== 'function') {
            console.error('Invalid seed file');
            process.exit(1);
          }
          seed(knex)
            .then(() => {
              const duration = ((Date.now() - startTime) / 1000).toFixed(2);
              console.log(`✅ Seed run complete in ${duration} seconds! 🎉`);

              process.exit(0);
            })
            .catch((e) => {
              console.error(e);
              process.exit(1);
            });
        })
        .catch((e) => {
          console.error(e);
          process.exit(1);
        });
    });
});
