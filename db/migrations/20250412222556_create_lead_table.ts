import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('leads', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').notNullable();
    table.string('status').notNullable();
    table.string('phone').nullable();
    table.string('preferredContactMethod').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table.index(['email']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('leads');
}
