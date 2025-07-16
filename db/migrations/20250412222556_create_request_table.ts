import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('leadId').notNullable();
    table.string('type').notNullable();
    table.string('subject').nullable();
    table.text('message').nullable();
    table.string('status').notNullable();
    table.uuid('entityId').nullable();
    table.string('note').nullable();

    table.foreign('leadId').references('id').inTable('leads');

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table.index(['leadId']);
    table.index(['status']);
    table.index(['type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('requests');
}
