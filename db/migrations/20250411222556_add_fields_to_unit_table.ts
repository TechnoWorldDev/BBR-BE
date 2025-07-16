import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.text('about').nullable();
    table.string('bathrooms').nullable();
    table.string('bedroom').nullable();
    table.string('floor').nullable();
    table.string('transactionType').notNullable();
    table.jsonb('characteristics').defaultTo('[]');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.dropColumn('about');
    table.dropColumn('bathrooms');
    table.dropColumn('bedroom');
    table.dropColumn('floor');
    table.dropColumn('transactionType');
    table.dropColumn('characteristics');
  });
}
