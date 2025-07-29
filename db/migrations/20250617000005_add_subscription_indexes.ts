import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add indexes to billing_subscriptions table
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    table.index(['residence_id', 'status'], 'idx_residence_status');
    table.index(['ranking_category_id', 'status'], 'idx_ranking_category_status');
    table.index(['status', 'current_period_end'], 'idx_status_period_end');
  });

  // Add indexes to billing_products table
  await knex.schema.alterTable('billing_products', (table) => {
    table.index(['type', 'active'], 'idx_type_active');
  });

  // Add indexes to residence_position_requests table
  await knex.schema.alterTable('residence_position_requests', (table) => {
    table.index(['subscription_id'], 'idx_subscription_id');
    table.index(['residence_id', 'subscription_status'], 'idx_residence_subscription_status');
    table.index(['requested_by', 'status'], 'idx_requested_by_status');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove indexes from billing_subscriptions table
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    table.dropIndex([], 'idx_residence_status');
    table.dropIndex([], 'idx_ranking_category_status');
    table.dropIndex([], 'idx_status_period_end');
  });

  // Remove indexes from billing_products table
  await knex.schema.alterTable('billing_products', (table) => {
    table.dropIndex([], 'idx_type_active');
  });

  // Remove indexes from residence_position_requests table
  await knex.schema.alterTable('residence_position_requests', (table) => {
    table.dropIndex([], 'idx_subscription_id');
    table.dropIndex([], 'idx_residence_subscription_status');
    table.dropIndex([], 'idx_requested_by_status');
  });
} 