import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('ranking_criteria').del();

  await knex('ranking_criteria').insert([
    {
      name: 'Location / Area',
      description:
        'Evaluates the attractiveness, safety, connectivity, and prestige of the property’s surrounding area, including proximity to key landmarks and amenities.',
    },
    {
      name: 'Service Quality',
      description:
        'Assesses the level of hospitality, responsiveness, and personalized services offered to residents, including concierge, maintenance, and security services.',
    },
    {
      name: 'Amenities / Facilities',
      description:
        'Measures the range and quality of on-site features such as wellness centers, dining options, recreational spaces, and other premium conveniences.',
    },
    {
      name: 'Investment / Value Potential',
      description:
        'Reflects the long-term financial attractiveness of the property, including market appreciation, rental yield, and developer reputation.',
    },
    {
      name: 'Design & Architecture',
      description:
        'Considers aesthetic appeal, innovation, functionality, and architectural distinctiveness of the property and its integration into the environment.',
    },
    {
      name: 'Culture, History and Heritage Impact',
      description:
        "Reflects the cultural significance and historical value of the property's location or design.",
    },
    {
      name: 'Eco-friendliness / Sustainability',
      description:
        'Assesses environmentally-friendly features and sustainable development practices.',
    },
    {
      name: 'Lifestyle',
      description: 'Evaluation based on characteristics related to lifestyle.',
    },
    {
      name: 'Natural Attractions / Scenic Views',
      description:
        'Considers surrounding natural beauty and scenic views available from the property.',
    },
    {
      name: 'Prestige Education',
      description:
        'Covers access to prestigious educational institutions or international schools.',
    },
    {
      name: 'Ski Resorts/Winter Sports',
      description: 'Evaluation based on characteristics related to ski resorts/winter sports.',
    },
    {
      name: 'Beachfront/Waterfront Access',
      description:
        'Evaluates the property’s direct access to beach, waterfront, or marina facilities.',
    },
    {
      name: 'Security / Privacy',
      description:
        'Measures the level of safety, privacy, and protection provided by the property and its surroundings.',
    },
    {
      name: 'Landmark views',
      description: 'Evaluation based on characteristics related to landmark views.',
    },
    {
      name: 'Celebrity Influence',
      description: 'Indicates the prestige and appeal for high-profile or celebrity residents.',
    },
    {
      name: 'Exclusivity',
      description: 'Evaluation based on characteristics related to exclusivity.',
    },
    {
      name: 'Cultural Diversity',
      description:
        "Reflects the cultural significance and historical value of the property's location or design.",
    },
    {
      name: 'Entertainment',
      description: 'Considers access to dining, nightlife, and cultural entertainment experiences.',
    },
    {
      name: 'Technology Hubs',
      description: 'Highlights the proximity to tech hubs.',
    },
    {
      name: 'Golf',
      description: 'Assesses the quality and proximity of golf courses available to residents.',
    },
    {
      name: 'Business hubs',
      description:
        'Evaluation based on characteristics related to business hubs and its proximities',
    },
    {
      name: 'Wellness and Spa',
      description:
        'Evaluates wellness facilities such as spas, fitness centers, and health amenities.',
    },
    {
      name: 'Culinary Experience',
      description: 'Considers access to dining, nightlife, and cultural entertainment experiences.',
    },
    {
      name: 'Pet Amenities and Services',
      description: 'Reflects family-oriented or pet-friendly infrastructure and services.',
    },
    {
      name: 'International Investments',
      description: 'Evaluation based on characteristics related to international investments.',
    },
    {
      name: 'Family-Friendly Environment',
      description: 'Reflects family-oriented infrastructure and services.',
    },
    {
      name: 'Healthcare Facilities',
      description: 'Measures accessibility and quality of nearby healthcare facilities.',
    },
    {
      name: 'Access to Outdoor Activities and Experiences',
      description:
        'Evaluation based on characteristics related to access to outdoor activities and experiences.',
    },
    {
      name: 'Marina Access and Yacht Services',
      description: 'Evaluates the property’s direct access to marina facilities or yacht services',
    },
    {
      name: 'Equestrian Facilities and Access',
      description: 'Highlights access to horse riding, stables, and equestrian services.',
    },
    {
      name: 'Wine Experience and Production.',
      description:
        'Reflects proximity to or integration with wine production and tasting experiences.',
    },
    {
      name: 'Adventure Activities',
      description:
        'Evaluation based on characteristics related to proximity to adventure activities.',
    },
    {
      name: 'Culture and Art Experiences',
      description: 'Evaluation based on characteristics related to culture and art experiences.',
    },
    {
      name: 'Smart-Home Systems',
      description: 'Highlights the presence of smart home systems',
    },
  ]);
}
