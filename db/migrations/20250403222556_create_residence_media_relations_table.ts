import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_media', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .uuid('residence_id')
      .notNullable()
      .references('id')
      .inTable('residences')
      .onDelete('CASCADE');
    table
      .uuid('media_id')
      .notNullable()
      .unique()
      .references('id')
      .inTable('media')
      .onDelete('CASCADE');
    table.enum('media_type', ['mainGallery', 'secondaryGallery']).notNullable();
    table.integer('order').defaultTo(0);
    table.timestamps(true, true);

    table.unique(['residence_id', 'media_id']);
    table.index(['residence_id', 'media_type']);
  });
}

export async function down(knex: Knex): Promise<void> {}
