import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // First, create a new table for subscription types
  await knex.schema.createTable('subscription_types', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable().unique(); // 'residence', 'ranking'
    table.string('description').nullable();
    table.timestamps(true, true);
  });

  // Insert default subscription types
  await knex('subscription_types').insert([
    { name: 'residence', description: 'Base subscription for managing a residence' },
    { name: 'ranking', description: 'Subscription for ranking in a specific category' }
  ]);

  // Modify the billing_subscriptions table
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    // Add new columns for the two-tier subscription system
    table.uuid('residence_id').references('id').inTable('residences').onDelete('CASCADE');
    table.uuid('ranking_category_id').references('id').inTable('ranking_categories').onDelete('CASCADE');
    
    // Add metadata for Stripe
    table.jsonb('metadata').nullable(); // For storing additional Stripe metadata
    
    // Update unique constraint to allow multiple subscriptions per user
    table.dropUnique(['user_id', 'product_id']);
    table.unique(['user_id', 'residence_id', 'ranking_category_id'], 'unique_user_residence_ranking');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Revert the billing_subscriptions table changes
  await knex.schema.alterTable('billing_subscriptions', (table) => {
    table.dropUnique([], 'unique_user_residence_ranking');
    table.unique(['user_id', 'product_id']);
    table.dropColumn('metadata');
    table.dropColumn('ranking_category_id');
    table.dropColumn('residence_id');
  });

  // Drop the subscription_types table
  await knex.schema.dropTableIfExists('subscription_types');
} 