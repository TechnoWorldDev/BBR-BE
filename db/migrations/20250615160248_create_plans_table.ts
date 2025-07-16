import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('product_id').notNullable().unique(); // Stripe product
    table.string('code').notNullable().unique(); // e.g. 'free','premium','custom'
    table.string('name').notNullable();
    table.text('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Seed
  await knex('plans').insert([
    { product_id: '', code: 'free', name: 'Free', description: 'Basic plan' },
    {
      product_id: 'prod_SIxQTbNo9izsbU',
      code: 'premium',
      name: 'Premium',
      description: 'Full features',
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('plans');
}
