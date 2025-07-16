import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('brand_types').del();

  await knex('brand_types').insert([
    { name: 'Luxury Hotel and Resort Brands' },
    { name: 'Automotive Brands' },
    { name: 'Fashion and Lifestyle Brands' },
  ]);
}
