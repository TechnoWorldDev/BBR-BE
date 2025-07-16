import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('billing_transactions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable();
    table.string('stripe_payment_intent_id').notNullable(); // stripe
    table.string('stripe_invoice_id'); // stripe
    table.string('stripe_product_id').notNullable(); // stripe
    table.string('stripe_price_id').notNullable(); // stripe
    table.string('stripe_hosting_invoice_url').nullable(); // stripe
    table.string('type').notNullable(); // one_time / subscription
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 10).defaultTo('USD');
    table.string('status').notNullable(); // succeeded, failed, etc.
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('billing_transactions');
}
