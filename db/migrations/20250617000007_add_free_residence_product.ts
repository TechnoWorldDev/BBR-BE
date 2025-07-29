import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Insert free residence subscription product
  await knex('billing_products').insert({
    name: 'Free Residence Plan',
    description: 'Free plan for basic residence management',
    feature_key: 'free_residence_plan',
    type: 'SUBSCRIPTION',
    stripe_product_id: 'prod_free_residence', // This will be updated with actual Stripe product ID
    stripe_price_id: 'price_free_residence', // This will be updated with actual Stripe price ID
    amount: 0.00,
    currency: 'USD',
    interval: 'month',
    active: true,
    metadata: JSON.stringify({
      subscription_type: 'residence',
      is_free: true,
      features: ['basic_residence_management']
    })
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the free residence product
  await knex('billing_products')
    .where('feature_key', 'free_residence_plan')
    .del();
} 