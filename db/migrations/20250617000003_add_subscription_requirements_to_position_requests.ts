import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residence_position_requests', (table) => {
    // Add subscription tracking
    table.uuid('subscription_id').nullable().references('id').inTable('billing_subscriptions').onDelete('SET NULL');
    
    // Add fields to track subscription requirements
    table.boolean('residence_subscription_required').notNullable().defaultTo(true);
    table.boolean('ranking_subscription_required').notNullable().defaultTo(true);
    
    // Add status for subscription validation
    table.string('subscription_status').nullable(); // 'pending', 'validated', 'invalid'
    
    // Add metadata for additional request information
    table.jsonb('metadata').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('residence_position_requests', (table) => {
    table.dropColumn('metadata');
    table.dropColumn('subscription_status');
    table.dropColumn('ranking_subscription_required');
    table.dropColumn('residence_subscription_required');
    table.dropColumn('subscription_id');
  });
} 