import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('key_features').del();

  // Inserts seed entries
  await knex('key_features').insert([
    { id: uuidv4(), name: 'Roof Deck / Patio' },
    { id: uuidv4(), name: 'Wine Cellar / Wine Room' },
    { id: uuidv4(), name: 'Home Theater' },
    { id: uuidv4(), name: 'Butler’s Pantry / Service Kitchen' },
    { id: uuidv4(), name: 'Private Elevator' },
    { id: uuidv4(), name: 'Private Pool' },
    { id: uuidv4(), name: 'Infinity Pool' },
    { id: uuidv4(), name: 'Spa / Wellness Area' },
    { id: uuidv4(), name: 'Private Garage' },
    { id: uuidv4(), name: 'Game Room / Entertainement Area' },
    { id: uuidv4(), name: 'Home Office' },
    { id: uuidv4(), name: 'Chef’s Kitchen' },
    { id: uuidv4(), name: 'Outdoor Kitchen / BBQ Area' },
    { id: uuidv4(), name: 'Fitness Room / Gym' },
    { id: uuidv4(), name: 'Panoramic Views' },
    { id: uuidv4(), name: 'Private Balcony / Terrace' },
  ]);
}
