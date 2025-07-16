import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('email_verification_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable();
    table.text('token').notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('expires_at').notNullable();
    table.timestamp('verified_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.index(['token']);
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('email_verification_requests');
}
