import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.dropColumn('type');

    table
      .uuid('unit_type_id')
      .nullable()
      .references('id')
      .inTable('unit_types'); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('units', (table) => {
    table.string('type').notNullable();
    table.dropColumn('unit_type_id');
  });
}
