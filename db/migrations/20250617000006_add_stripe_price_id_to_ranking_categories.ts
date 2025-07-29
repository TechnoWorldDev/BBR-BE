import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.string('stripe_price_id').nullable();
    table.index('stripe_price_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.dropIndex('stripe_price_id');
    table.dropColumn('stripe_price_id');
  });
} 