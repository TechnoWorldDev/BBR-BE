import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('residence_ranking_criteria_scores', (table) => {
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

    table
      .uuid('ranking_criteria_id')
      .notNullable()
      .references('id')
      .inTable('ranking_criteria')
      .onDelete('CASCADE');

    table.integer('score').notNullable(); // ocena od 1 do 10 ili 0 do 100 po tvojoj skali

    table.timestamps(true, true);

    table.unique(['residence_id', 'ranking_category_id', 'ranking_criteria_id']); // jedan unos po kriterijumu
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('residence_ranking_criteria_scores');
}
