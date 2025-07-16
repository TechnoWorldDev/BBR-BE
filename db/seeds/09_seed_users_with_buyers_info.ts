import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Fetch the buyer role ID
  const buyerRole = await knex('roles').select('id').where({ name: 'buyer' }).first();

  if (!buyerRole) {
    console.log('Buyer role not found, skipping seeder.');
    return;
  }

  // Fetch all users with role `buyer`
  const buyers = await knex('users').select('id').where({ role_id: buyerRole.id });

  if (buyers.length === 0) {
    console.log('No users found with role buyer, skipping seeder.');
    return;
  }

  const usCountry = await knex('countries').select('id').where({ code: 'US' }).first();

  if (!usCountry) {
    console.log('Country with code "US" not found, skipping seeder.');
    return;
  }

  // Fetch available unit types and lifestyles
  const unitTypes = await knex('unit_types').select('id');
  const lifestyles = await knex('lifestyles').select('id');

  for (const buyer of buyers) {
    const existingBuyer = await knex('user_buyers').where({ user_id: buyer.id }).first();

    if (!existingBuyer) {
      // Insert into `user_buyers`
      await knex('user_buyers').insert({
        user_id: buyer.id,
        image_id: null,
        current_location: usCountry.id, // Replace with actual country ID
        budget_range_from: '50000',
        budget_range_to: '100000',
        phone_number: '+1234567890',
        preferred_contact_method: 'email',
        preferred_residence_location: usCountry.id, // Replace with actual country ID
      });

      console.log(`UserBuyer created for user ${buyer.id}`);
    }

    // Check and assign `unit_types`
    const assignedUnitTypes = await knex('user_buyer_unit_types').where({ user_id: buyer.id });

    if (assignedUnitTypes.length === 0 && unitTypes.length > 0) {
      const buyerUnitTypes = unitTypes.slice(0, 2).map((unitType) => ({
        user_id: buyer.id,
        unit_type_id: unitType.id,
      }));

      await knex('user_buyer_unit_types').insert(buyerUnitTypes);
      console.log(`Assigned unit types to user ${buyer.id}`);
    }

    // Check and assign `lifestyles`
    const assignedLifestyles = await knex('user_buyer_lifestyles').where({ user_id: buyer.id });

    if (assignedLifestyles.length === 0 && lifestyles.length > 0) {
      const buyerLifestyles = lifestyles.slice(0, 3).map((lifestyle) => ({
        user_id: buyer.id,
        lifestyle_id: lifestyle.id,
      }));

      await knex('user_buyer_lifestyles').insert(buyerLifestyles);
      console.log(`Assigned lifestyles to user ${buyer.id}`);
    }
  }
}
