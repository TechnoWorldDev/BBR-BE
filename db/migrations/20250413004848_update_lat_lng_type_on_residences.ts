import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('residences', function (table) {
    table.double('latitude').alter();
    table.double('longitude').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('residences', function (table) {
    table.string('latitude').alter();
    table.string('longitude').alter();
  });
}
