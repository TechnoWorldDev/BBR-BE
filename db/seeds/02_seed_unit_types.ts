import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('unit_types').del(); // Clear existing data

  await knex('unit_types').insert([
    { id: knex.raw('uuid_generate_v4()'), name: 'Penthouse' },
    { id: knex.raw('uuid_generate_v4()'), name: 'Villa' },
    { id: knex.raw('uuid_generate_v4()'), name: 'Condo' },
    { id: knex.raw('uuid_generate_v4()'), name: 'Townhouse' },
    { id: knex.raw('uuid_generate_v4()'), name: 'Estate home' },
  ]);
}
