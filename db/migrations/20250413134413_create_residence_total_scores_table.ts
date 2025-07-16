import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('residence_total_scores', (table) => {
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
    table.float('total_score').notNullable(); // ukupni score za tu kategoriju
    table.integer('position').nullable(); // za top 1, 2, 3...
    table.timestamps(true, true);

    table.unique(['residence_id', 'ranking_category_id']); // unique par
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('residence_total_scores');
}
