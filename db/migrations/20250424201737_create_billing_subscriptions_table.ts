import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('billing_subscriptions');

  return knex.schema.createTable('billing_subscriptions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().index();
    table.string('product_id').notNullable().index(); // stripe
    table.string('subscription_id').notNullable(); // stripe
    table.timestamp('current_period_end').notNullable();
    table.string('status').notNullable(); // ['active', 'past_due', 'canceled', 'incomplete']
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['user_id', 'product_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('billing_subscriptions');
}
