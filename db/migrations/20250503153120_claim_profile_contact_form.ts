import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('claim_profile_contact_forms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email').notNullable();
    table.string('phone_number', 20).notNullable();
    table.uuid('phone_code_id').references('id').inTable('phone_codes');
    table.string('website_url', 255).notNullable();
    table.uuid('cv_id').references('id').inTable('media').nullable();
    table.string('status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at').nullable();

    table.index(['email', 'status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('claim_profile_contact_forms');
}
