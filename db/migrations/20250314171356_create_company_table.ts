import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('companies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('address').nullable();
    table.uuid('image_id').nullable().references('id').inTable('media').onDelete('SET NULL');
    table.string('phone_number').nullable();
    table.string('phone_number_country_code', 5).nullable();
    table.string('website').nullable();

    // Contact Person Fields
    table
      .uuid('contact_person_avatar_id')
      .nullable()
      .references('id')
      .inTable('media')
      .onDelete('SET NULL');
    table.string('contact_person_full_name').nullable();
    table.string('contact_person_job_title').nullable();
    table.string('contact_person_email').nullable();
    table.string('contact_person_phone_number').nullable();
    table.string('contact_person_phone_number_country_code', 5).nullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('companies');
}
