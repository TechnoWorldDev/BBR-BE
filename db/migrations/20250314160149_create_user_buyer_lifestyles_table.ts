import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_buyer_lifestyles', (table) => {
    table.uuid('user_id').notNullable();
    table.uuid('lifestyle_id').notNullable();

    table.primary(['user_id', 'lifestyle_id']);

    table.foreign('user_id').references('user_id').inTable('user_buyers').onDelete('CASCADE');

    table.foreign('lifestyle_id').references('id').inTable('lifestyles').onDelete('CASCADE');

    table.index(['user_id'], 'idx_ubl_user');
    table.index(['lifestyle_id'], 'idx_ubl_lifestyle');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_buyer_lifestyles');
}
