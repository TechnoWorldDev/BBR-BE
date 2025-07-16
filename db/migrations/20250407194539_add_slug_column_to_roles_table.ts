import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.string('slug').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('roles', (table) => {
    table.dropColumn('slug');
  });
}
