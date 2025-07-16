import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('brands', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('status', 32).notNullable().defaultTo('DRAFT');
    table
      .uuid('brand_type_id')
      .notNullable()
      .references('id')
      .inTable('brand_types')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at').nullable();
    table.uuid('logo_id').references('id').inTable('media').onDelete('SET NULL');

    // Indexes for performance
    table.index(['name']);
    table.index(['brand_type_id']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('brands');
}
