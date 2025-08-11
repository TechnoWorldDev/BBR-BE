import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residence_verifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('userId').notNullable();
    table.uuid('residenceId').nullable();
    
    // Verification details
    table.string('verificationType').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.decimal('price', 10, 2).notNullable();
    table.string('paymentStatus').notNullable().defaultTo('unpaid');
    
    // Additional information
    table.text('notes').nullable();
    table.text('adminNotes').nullable();
    
    // Virtual verification specific fields
    table.string('meetingLink').nullable();
    table.string('platform').nullable(); // zoom, teams, etc.
    table.date('scheduledDate').nullable();
    table.string('scheduledTime').nullable();
    
    // Physical verification specific fields
    table.date('preferredDate').nullable();
    table.string('preferredTime').nullable();
    table.integer('numberOfVisitors').nullable();
    
    // Payment related fields
    table.string('stripePaymentIntentId').nullable();
    table.string('stripeInvoiceId').nullable();

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    // Foreign keys
    table.foreign('userId').references('id').inTable('users');
    table.foreign('residenceId').references('id').inTable('residences');

    // Indexes
    table.index(['userId']);
    table.index(['residenceId']);
    table.index(['status']);
    table.index(['verificationType']);
    table.index(['paymentStatus']);
    table.index(['createdAt']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('residence_verifications');
}
