import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('billing_products', (table) => {
    // Add metadata for additional product information
    table.jsonb('metadata').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('billing_products', (table) => {
    table.dropColumn('metadata');
  });
} 