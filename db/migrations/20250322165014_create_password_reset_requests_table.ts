import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('password_reset_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable();
    table.string('otp', 10).notNullable();
    table.string('reset_token').notNullable();
    table.boolean('is_verified').notNullable().defaultTo(false);
    table.timestamp('expires_at').notNullable();
    table.timestamp('verified_at').nullable();
    table.timestamp('used_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['email']);
    table.index(['reset_token']);
    table.index(['expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('password_reset_requests');
}
