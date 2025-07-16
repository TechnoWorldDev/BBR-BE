import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_amenity_relations', (table) => {
    table
      .uuid('residence_id')
      .notNullable()
      .references('id')
      .inTable('residences')
      .onDelete('CASCADE');

    table
      .uuid('amenity_id')
      .notNullable()
      .references('id')
      .inTable('amenities')
      .onDelete('CASCADE');

    table.primary(['residence_id', 'amenity_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residence_amenity_relations');
}
