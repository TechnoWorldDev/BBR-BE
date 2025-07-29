import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // First, clean up duplicate records by keeping the latest one for each unique combination
  await knex.raw(`
    DELETE FROM billing_subscriptions 
    WHERE id NOT IN (
      SELECT MAX(id) 
      FROM billing_subscriptions 
      GROUP BY user_id, residence_id, COALESCE(ranking_category_id, ''), subscription_id
    )
  `);

  // Add unique constraint for upsert operation
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    table.unique(['user_id', 'residence_id', 'ranking_category_id', 'subscription_id'], 'idx_user_residence_ranking_subscription_unique');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    table.dropUnique(['user_id', 'residence_id', 'ranking_category_id', 'subscription_id'], 'idx_user_residence_ranking_subscription_unique');
  });
}