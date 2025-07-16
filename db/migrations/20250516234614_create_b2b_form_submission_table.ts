import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('b2b_form_submissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('phone_number', 50).notNullable();
    table.string('email').notNullable();
    table.string('company_name', 255).nullable();
    table.string('branded_residences_name', 255).nullable();
    table.string('company_website').nullable();
    table.string('page_origin').notNullable();
    table.string('status').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at').nullable();

    table.index(['email', 'status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('b2b_form_submissions');
}
