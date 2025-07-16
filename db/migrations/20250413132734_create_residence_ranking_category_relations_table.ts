import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('residence_ranking_categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('residence_id')
      .notNullable()
      .references('id')
      .inTable('residences')
      .onDelete('CASCADE');
    table
      .uuid('ranking_category_id')
      .notNullable()
      .references('id')
      .inTable('ranking_categories')
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('residence_ranking_categories');
}
