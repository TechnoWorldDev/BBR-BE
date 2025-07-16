import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('stripe_customers', (table) => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('stripe_customer_id').notNullable().unique();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('stripe_customers');
}
