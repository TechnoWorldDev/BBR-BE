import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.uuid('company_id').nullable().references('id').inTable('companies').onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('company_id');
  });
}
