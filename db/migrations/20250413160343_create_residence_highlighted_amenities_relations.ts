import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_highlighted_amenities', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
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
    table.integer('order').nullable();
    table.timestamps(true, true);

    table.unique(['residence_id', 'amenity_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residence_highlighted_amenities');
}
