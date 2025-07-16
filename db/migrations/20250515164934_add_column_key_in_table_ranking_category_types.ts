import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_category_types', (table) => {
    table.string('key').nullable();
  });

  await knex.raw(`
    UPDATE ranking_category_types
    SET key = regexp_replace(lower(name), '[^a-z0-9]+', '_', 'g')
  `);

  await knex.schema.alterTable('ranking_category_types', (table) => {
    table.string('key').notNullable().unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_category_types', (table) => {
    table.dropColumn('key');
  });
}
