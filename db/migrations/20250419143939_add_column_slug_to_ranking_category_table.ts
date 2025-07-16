import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Dodaj kolonu bez NOT NULL
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.string('slug');
  });

  // 2. Omogući unaccent ako nije već instaliran
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS unaccent`);

  // 3. Popuni slug na osnovu name
  await knex.raw(`
    UPDATE "ranking_categories"
    SET "slug" = regexp_replace(
      lower(unaccent("name")),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  `);

  // 4. Postavi NOT NULL i UNIQUE constraint
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.string('slug').notNullable().unique().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ranking_categories', (table) => {
    table.dropColumn('slug');
  });
}
