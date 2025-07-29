import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('billing_products', (table) => {
    // Add is_premium boolean field with default value false
    table.boolean('is_premium').defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('billing_products', (table) => {
    table.dropColumn('is_premium');
  });
}