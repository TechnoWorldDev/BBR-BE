import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('amenities', (table) => {
    table
      .uuid('featured_image_id')
      .nullable()
      .references('id')
      .inTable('media')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('amenities', (table) => {
    table.dropColumn('featured_image_id');
  });
}
