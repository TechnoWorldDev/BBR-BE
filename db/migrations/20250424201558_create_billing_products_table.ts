import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('billing_products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('description').nullable(); // Dodato za opis proizvoda
    table.string('feature_key').notNullable(); // npr. unlock_bonus
    table.string('type').notNullable(); //'ONE_TIME', 'SUBSCRIPTION'
    table.string('stripe_product_id').notNullable(); // stripe
    table.string('stripe_price_id').notNullable(); // stripe
    table.decimal('amount', 10, 2).notNullable(); // Dodato za amount lokalno
    table.string('currency', 10).notNullable().defaultTo('USD'); // Dodato za valutu
    table.string('interval', 10).notNullable();
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('billing_products');
}
