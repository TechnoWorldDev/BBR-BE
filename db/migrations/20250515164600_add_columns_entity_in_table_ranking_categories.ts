import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.uuid('entityId').nullable();
    table.string('entityType').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.dropColumn('entityId');
    table.dropColumn('entityType');
  });
}
