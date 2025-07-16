import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('units', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('residence_id').notNullable().references('id').inTable('residences');
    table.string('name').notNullable();
    table.text('description').nullable();
    table.float('surface').notNullable();
    table.string('status').notNullable();
    table.float('regular_price').notNullable();
    table.float('exclusive_price').nullable();
    table.date('exclusive_offer_start_date').nullable();
    table.date('exclusive_offer_end_date').nullable();
    table.string('room_type').notNullable();
    table.integer('room_amount').notNullable();
    table.string('type').notNullable();
    table.string('service_type').notNullable();
    table.float('service_amount').notNullable();
    table.uuid('feature_image_id').nullable();

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table.index(['residence_id']);
    table.index(['name']);
  });

  await knex.schema.createTable('unit_gallery', (table) => {
    table.uuid('unit_id').notNullable().references('id').inTable('units');
    table.uuid('media_id').notNullable().references('id').inTable('media');
    table.primary(['unit_id', 'media_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('unit_gallery');
  await knex.schema.dropTableIfExists('units');
}
