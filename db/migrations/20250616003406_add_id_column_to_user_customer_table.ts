// migrations/20250616_add_id_to_stripe_customers.ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('stripe_customers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('stripe_customers', (table) => {
    table.dropPrimary();
    table.dropColumn('id');
  });
}
