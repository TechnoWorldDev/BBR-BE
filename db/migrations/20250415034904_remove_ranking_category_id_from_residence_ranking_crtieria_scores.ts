import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residence_ranking_criteria_scores', (table) => {
    table.dropColumn('ranking_category_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residence_ranking_criteria_scores', (table) => {
    table
      .uuid('ranking_category_id')
      .references('id')
      .inTable('ranking_categories')
      .onDelete('CASCADE')
      .notNullable(); // ili .nullable() ako je ranije bila nullable
  });
}
