import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // ✅ Auto-generate UUID
    table.string('full_name', 64).notNullable();
    table.string('email', 128).notNullable().unique();
    table.string('password', 256).nullable();
    table.string('signup_method').notNullable().defaultTo('email');
    table.enum('status', ['ACTIVE', 'INACTIVE', 'INVITED']).notNullable().defaultTo('INACTIVE');
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.boolean('agreed_terms').notNullable().defaultTo(false);
    table.boolean('receive_luxury_insights').notNullable().defaultTo(false);
    table.boolean('notify_latest_news').notNullable().defaultTo(false);
    table.boolean('notify_market_trends').notNullable().defaultTo(false);
    table.boolean('notify_blogs').notNullable().defaultTo(false);
    table.boolean('push_notifications').notNullable().defaultTo(false);
    table.boolean('email_notifications').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
