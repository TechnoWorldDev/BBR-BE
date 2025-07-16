import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ranking_category_criteria', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('ranking_category_id')
      .notNullable()
      .references('id')
      .inTable('ranking_categories')
      .onDelete('CASCADE');
    table
      .uuid('ranking_criteria_id')
      .notNullable()
      .references('id')
      .inTable('ranking_criteria')
      .onDelete('CASCADE');
    table.integer('weight').notNullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.unique(['ranking_category_id', 'ranking_criteria_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('ranking_category_criteria');
}
