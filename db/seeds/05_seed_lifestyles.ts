import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('lifestyles').del(); // Clear existing data

  const lifestyleNames = [
    'Newest Branded Residences',
    'Investment Opportunities',
    'Pet-Friendly Residences',
    'Beachfront Living',
    'Golf Living',
    'Emerging Markets',
    'Best for Couples',
    'Ski Resort Living',
    'Cultural Hotspots',
    'Best for Families',
    'Urban High-Rise Luxury Living',
    'Best for Working Professionals',
    'Retirement Havens',
    'Mountain/Resort Living',
    'Eco-Friendly Living',
    'Wellness-Focused Living',
    'Historic/Cultural Living',
    'Yacht Club Living',
    'Equestrian Lifestyle',
    'Winery/Vineyard Lifestyle',
    'Adventure Lifestyle',
    'Culinary Lifestyle',
    'Art and Culture Lifestyle',
    'Smart Tech-Enabled Living',
    'Green Energy Lifestyle',
  ];

  const lifestyles = lifestyleNames.map((name, index) => ({
    id: knex.raw('uuid_generate_v4()'),
    order: index + 1, // Assigns order based on position
    name,
  }));

  await knex('lifestyles').insert(lifestyles);
}
