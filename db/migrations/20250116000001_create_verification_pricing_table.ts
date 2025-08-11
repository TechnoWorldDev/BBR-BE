import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('verification_pricing', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('verification_type').notNullable().unique(); // 'virtual' or 'physical'
    table.decimal('price', 10, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('USD');
    table.string('description').nullable();
    table.string('stripe_price_id').nullable(); // Stripe price ID for this verification type
    table.boolean('active').defaultTo(true);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['verification_type']);
    table.index(['active']);
  });

  // Seed initial pricing data
  await knex('verification_pricing').insert([
    {
      verification_type: 'virtual',
      price: 99.00,
      currency: 'USD',
      description: 'Virtual Residence Verification',
      active: true,
    },
    {
      verification_type: 'physical',
      price: 1500.00,
      currency: 'USD',
      description: 'Physical Residence Verification',
      active: true,
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('verification_pricing');
}
