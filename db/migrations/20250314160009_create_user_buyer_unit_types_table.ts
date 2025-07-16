import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_buyer_unit_types', (table) => {
    table.uuid('user_id').notNullable();
    table.uuid('unit_type_id').notNullable();

    table.primary(['user_id', 'unit_type_id']);

    table.foreign('user_id').references('user_id').inTable('user_buyers').onDelete('CASCADE');

    table.foreign('unit_type_id').references('id').inTable('unit_types').onDelete('CASCADE');

    table.index(['user_id'], 'idx_ubut_user');
    table.index(['unit_type_id'], 'idx_ubut_unit');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_buyer_unit_types');
}
