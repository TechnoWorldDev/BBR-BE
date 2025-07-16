// migrations/20250617_add_position_requests_table.ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_position_requests', (table) => {
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
      .integer('requested_position')
      .nullable()
      .comment('The new position the user is asking for');

    table
      .uuid('requested_by')
      .notNullable()
      .references('id')
      .inTable('users')
      .comment('Who asked for the bump');

    table.timestamp('requested_at').notNullable().defaultTo(knex.fn.now());

    table.string('status').notNullable().defaultTo('NEW');

    table
      .uuid('reviewed_by')
      .nullable()
      .references('id')
      .inTable('users')
      .comment('Which admin handled it');

    table.timestamp('reviewed_at').nullable();

    table.text('review_notes').nullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index(['residence_id']);
    table.index(['ranking_category_id']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residence_position_requests');
}
