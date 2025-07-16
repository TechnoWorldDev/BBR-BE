import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_ranking_score_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table.uuid('residence_id').notNullable();
    table.uuid('ranking_criteria_id').notNullable();
    table.decimal('score', 6, 2).notNullable();

    table.string('operation_type').notNullable(); // 'CREATE' or 'UPDATE'

    table.timestamp('changed_at').notNullable().defaultTo(knex.fn.now());
    table.string('changed_by'); // Optional: user email, userId, etc.

    table.foreign('residence_id').references('id').inTable('residences').onDelete('CASCADE');
    table.foreign('ranking_criteria_id').references('id').inTable('ranking_criteria').onDelete('CASCADE');

    table.index(['residence_id', 'ranking_criteria_id']);
  });

  await knex.schema.createTable('residence_total_score_history', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table.uuid('residence_id').notNullable();
    table.uuid('ranking_category_id').notNullable();
    table.decimal('total_score', 6, 2).notNullable();
    table.integer('position');

    table.string('operation_type').notNullable(); // 'CREATE' or 'UPDATE'

    table.timestamp('changed_at').notNullable().defaultTo(knex.fn.now());
    table.string('changed_by');

    table.foreign('residence_id').references('id').inTable('residences').onDelete('CASCADE');
    table.foreign('ranking_category_id').references('id').inTable('ranking_categories').onDelete('CASCADE');

    table.index(['residence_id', 'ranking_category_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residence_total_score_history');
  await knex.schema.dropTableIfExists('residence_ranking_score_history');
}
