import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_key_feature_relations', (table) => {
    table
      .uuid('residence_id')
      .notNullable()
      .references('id')
      .inTable('residences')
      .onDelete('CASCADE');
    table
      .uuid('key_feature_id')
      .notNullable()
      .references('id')
      .inTable('key_features')
      .onDelete('CASCADE');

    table.primary(['residence_id', 'key_feature_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residence_key_feature_relations');
}
