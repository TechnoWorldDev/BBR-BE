import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contact_forms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email').notNullable();
    table.string('link').notNullable();
    table.string('type').notNullable();
    table.string('description', 2000).notNullable();
    table.uuid('attachment_id').references('id').inTable('media').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at').nullable();

    table.index(['email', 'type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('contact_forms');
}
