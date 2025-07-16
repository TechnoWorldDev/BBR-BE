import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  await knex('roles').del(); // Clear existing data

  await knex('roles').insert([
    { id: uuidv4(), name: 'superadmin', description: 'Full access to the system' },
    { id: uuidv4(), name: 'admin', description: 'Basic Admin access' },
    { id: uuidv4(), name: 'developer', description: 'Can manage developer content' },
    { id: uuidv4(), name: 'buyer', description: 'Can manage buyer content' },
    { id: uuidv4(), name: 'guest', description: 'Guest' },
  ]);
}
