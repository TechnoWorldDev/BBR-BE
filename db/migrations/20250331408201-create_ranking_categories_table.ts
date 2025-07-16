import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ranking_categories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('description').nullable();
    table.integer('residence_limitation').nullable();
    table.decimal('ranking_price', 10, 2).nullable();
    table.string('status').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table
      .uuid('rankingCategoryTypeId')
      .notNullable()
      .references('id')
      .inTable('ranking_category_types');

    table.uuid('featuredImageId').nullable().references('id').inTable('media');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('ranking_categories');
}
