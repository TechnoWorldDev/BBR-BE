import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('leads', (table) => {
    table.dropColumn('preferredContactMethod');
  });

  await knex.schema.alterTable('leads', (table) => {
    table.jsonb('preferredContactMethod').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('leads', (table) => {
    table.dropColumn('preferredContactMethod');
  });

  await knex.schema.alterTable('leads', (table) => {
    table.string('preferredContactMethod').nullable();
  });
}
