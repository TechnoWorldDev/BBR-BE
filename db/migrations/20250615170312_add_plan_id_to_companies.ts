import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('companies', (table) => {
    table.uuid('plan_id').nullable().references('id').inTable('plans').onDelete('SET NULL');

    table.index('plan_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('companies', (table) => {
    table.dropIndex('plan_id');
    table.dropColumn('plan_id');
  });
}
