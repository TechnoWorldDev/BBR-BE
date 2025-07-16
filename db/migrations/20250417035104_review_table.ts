import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('residence_id').references('id').inTable('residences').notNullable();
    table.uuid('user_id').references('id').inTable('users').notNullable();
    table.uuid('unit_type_id').references('id').inTable('unit_types').notNullable();
    table.date('date_of_purchase').notNullable();
    table.boolean('is_primary_residence').notNullable();
    table.boolean('verified_owner_or_tenant').notNullable();
    table.integer('build_quality').notNullable();
    table.integer('purchase_experience_rating').notNullable();
    table.integer('amenities').notNullable();
    table.integer('neighbourhood_location').notNullable();
    table.integer('value_for_money').notNullable();
    table.integer('service_quality').notNullable();
    table.string('additional_feedback', 1024).nullable();
    table.string('status');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at').nullable();

    table.index(['residence_id', 'user_id', 'unit_type_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reviews');
}
