import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_buyers', (table) => {
    table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('image_id').nullable().references('id').inTable('media').onDelete('SET NULL');
    table.string('phone_number').nullable();
    table.string('phone_number_country_code').nullable();
    table.string('preferred_contact_method').nullable();
    table.integer('budget_range_from').nullable();
    table.integer('budget_range_to').nullable();
    table
      .uuid('current_location')
      .nullable()
      .references('id')
      .inTable('countries')
      .onDelete('SET NULL');
    table
      .uuid('preferred_residence_location')
      .nullable()
      .references('id')
      .inTable('countries')
      .onDelete('SET NULL');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_buyers');
}
