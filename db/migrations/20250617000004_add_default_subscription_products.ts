import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Insert default residence subscription product
  await knex('billing_products').insert({
    name: 'Residence Management Subscription',
    description: 'Monthly subscription for managing a residence',
    feature_key: 'residence_management',
    type: 'SUBSCRIPTION',
    stripe_product_id: 'prod_residence_management', // This will be updated with actual Stripe product ID
    stripe_price_id: 'price_residence_management', // This will be updated with actual Stripe price ID
    amount: 29.99,
    currency: 'USD',
    interval: 'month',
    active: true,
    metadata: JSON.stringify({
      subscription_type: 'residence',
      features: ['residence_management', 'basic_analytics']
    })
  });

  // Insert default ranking subscription product
  await knex('billing_products').insert({
    name: 'Ranking Category Subscription',
    description: 'Monthly subscription for ranking in a specific category',
    feature_key: 'ranking_category',
    type: 'SUBSCRIPTION',
    stripe_product_id: 'prod_ranking_category', // This will be updated with actual Stripe product ID
    stripe_price_id: 'price_ranking_category', // This will be updated with actual Stripe price ID
    amount: 19.99,
    currency: 'USD',
    interval: 'month',
    active: true,
    metadata: JSON.stringify({
      subscription_type: 'ranking',
      features: ['ranking_visibility', 'position_requests', 'analytics']
    })
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the default subscription products
  await knex('billing_products')
    .whereIn('feature_key', ['residence_management', 'ranking_category'])
    .del();
} 