import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.dropColumn('service_type');
    table.dropColumn('service_amount');
    table.jsonb('services').notNullable().defaultTo(knex.raw(`'[]'::jsonb`));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.dropColumn('services');
    table.string('service_type').notNullable();
    table.float('service_amount').notNullable();
  });
}
