import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('media', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('original_file_name').notNullable();
    table.string('upload_status', 32).notNullable().defaultTo('PENDING');
    table.string('storage', 32).notNullable();
    table.string('base_path').notNullable();
    table.integer('size').notNullable();
    table.string('external_id').nullable();
    table.string('mime_type').notNullable();
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('media');
}
