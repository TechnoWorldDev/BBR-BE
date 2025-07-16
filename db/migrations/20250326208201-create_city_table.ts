import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cities', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); 
    table.string('name').notNullable(); 
    table.string('ascii_name').notNullable(); 
    table.integer('population').notNullable(); 
    table.string('timezone').notNullable(); 
    table.string('x_coordinate').nullable(); 
    table.string('y_coordinate').nullable(); 
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now()); 
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable(); 

    table.uuid('country_id')
    .notNullable()
    .references('id')
    .inTable('countries');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cities');
}
