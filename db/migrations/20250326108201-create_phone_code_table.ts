import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('phone_codes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); 
    table.string('code').notNullable(); 
    table.uuid('country_id') 
      .notNullable()
      .references('id')
      .inTable('countries'); 
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('phone_codes');
}
