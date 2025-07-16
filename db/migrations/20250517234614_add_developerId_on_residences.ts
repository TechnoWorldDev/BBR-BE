import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residences', (table) => {
    table
      .uuid('developer_id')
      .nullable();

    table
      .foreign('developer_id', 'fk_residence_user_id')
      .references('id')
      .inTable('users');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residences', (table) => {
    table.dropForeign(['developer_id'], 'fk_residence_user_id');
    table.dropColumn('developer_id');
  });
}
