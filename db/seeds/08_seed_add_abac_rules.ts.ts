import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('abac_rules').del();

  const abacRules = [
    {
      name: 'can_edit_own_profile',
      conditions: JSON.stringify({
        resource: 'users',
        action: 'edit',
        condition: { field: 'id', operator: '==', value: '{{user.id}}' },
      }),
    },
    {
      name: 'can_manage_products',
      conditions: JSON.stringify({
        resource: 'products',
        action: 'manage',
        condition: { field: 'owner_id', operator: '==', value: '{{user.id}}' },
      }),
    },
  ];

  for (const rule of abacRules) {
    const exists = await knex('abac_rules').where('name', rule.name).first();
    if (!exists) {
      await knex('abac_rules').insert(rule);
    }
  }
}
