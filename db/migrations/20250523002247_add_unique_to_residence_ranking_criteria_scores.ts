import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('residence_ranking_criteria_scores', (table) => {
    table.unique(['residence_id', 'ranking_criteria_id'], 'ux_residence_criteria');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('residence_ranking_criteria_scores', (table) => {
    table.dropUnique(['residence_id', 'ranking_criteria_id'], 'ux_residence_criteria');
  });
}
