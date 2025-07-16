import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('countries', (table) => {
    table.string('tld').notNullable();
    table.string('currency_code').notNullable();
    table.string('currency_name').notNullable();
    table.string('currency_symbol').notNullable();
    table.string('capital').notNullable();
    table.string('subregion').notNullable();
    table.text('flag').notNullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    table.uuid('continent_id')
      .notNullable()
      .references('id')
      .inTable('continents');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('countries', (table) => {
    table.dropForeign('continent_id');
    table.dropColumn('continent_id');

    table.dropColumn('created_at');
    table.dropColumn('updated_at');
    table.dropColumn('deleted_at');
    
    table.dropColumn('tld');
    table.dropColumn('currency_code');
    table.dropColumn('currency_name');
    table.dropColumn('currency_symbol');
    table.dropColumn('capital');
    table.dropColumn('subregion');
  });
}
