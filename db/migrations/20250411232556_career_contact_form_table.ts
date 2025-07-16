import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the 'contact_forms' table
  await knex.schema.createTable('career_contact_forms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('full_name').notNullable();
    table.string('email').notNullable();
    table.string('phone').nullable();
    table.string('linkedin').nullable();
    table.text('message').nullable();
    table.uuid('cv_id').nullable().references('id').inTable('media');
    table.string('position').nullable();
    table.string('website_url').nullable();
    table.string('status').notNullable();
    table.string('note').nullable();

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table.index(['status']);
    table.index(['email']);
    table.index(['full_name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('career_contact_forms');
}
