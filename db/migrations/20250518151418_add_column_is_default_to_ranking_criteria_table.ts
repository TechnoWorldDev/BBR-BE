import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Remove from pivot table
  const hasOldColumn = await knex.schema.hasColumn('ranking_category_criteria', 'is_default');
  if (hasOldColumn) {
    await knex.schema.alterTable('ranking_category_criteria', (table) => {
      table.dropColumn('is_default');
    });
  }

  // 2. Add to main table
  const hasNewColumn = await knex.schema.hasColumn('ranking_criteria', 'is_default');
  if (!hasNewColumn) {
    await knex.schema.alterTable('ranking_criteria', (table) => {
      table.boolean('is_default').defaultTo(false).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Revert back
  const hasNewColumn = await knex.schema.hasColumn('ranking_criteria', 'is_default');
  if (hasNewColumn) {
    await knex.schema.alterTable('ranking_criteria', (table) => {
      table.dropColumn('is_default');
    });
  }

  const hasOldColumn = await knex.schema.hasColumn('ranking_category_criteria', 'is_default');
  if (!hasOldColumn) {
    await knex.schema.alterTable('ranking_category_criteria', (table) => {
      table.boolean('is_default').defaultTo(false).notNullable();
    });
  }
}
