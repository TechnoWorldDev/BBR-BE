import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invites', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('email').notNullable();
    table.text('token').notNullable();
    table.string('role').nullable(); // admin, member, etc.
    table.timestamp('expires_at').notNullable();
    table.timestamp('accepted_at').nullable();
    table.uuid('created_by').nullable(); // user_id who sent invite
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['token']);
    table.index(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('invites');
}
