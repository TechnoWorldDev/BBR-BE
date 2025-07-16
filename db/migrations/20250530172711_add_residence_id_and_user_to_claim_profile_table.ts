import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('claim_profile_contact_forms', (table) => {
    table
      .uuid('residence_id')
      .nullable()
      .references('id')
      .inTable('residences')
      .onDelete('CASCADE');

    table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');

    table.index(['residence_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('claim_profile_contact_forms', (table) => {
    table.dropIndex(['residence_id']);
    table.dropColumn('residence_id');

    table.dropColumn('user_id');
  });
}
