import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('billing_payment_methods', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().index();
    table.string('payment_method_id').notNullable().unique(); // stripe
    table.string('brand').notNullable(); // visa, mastercard...
    table.string('last4').notNullable();
    table.integer('exp_month').notNullable();
    table.integer('exp_year').notNullable();
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('billing_payment_methods');
}
