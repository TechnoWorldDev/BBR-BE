import { Knex } from 'knex';

// * LIVE
const adminRoleId = 'e0f9da2d-daa9-4a29-aa26-6dd1619ee7b8';
const managerRoleId = 'fa9a57fc-ade4-4e96-be36-570e269b7a9c';

// * LOCAL
// const adminRoleId = '1810ad7b-d504-4576-ab96-c2f27328033e';
// const managerRoleId = '16627f92-6b84-48f1-8b72-658ffda59b86';

const allPermissions = [
  'users.create',
  'users.read',
  'users.update',
  'users.delete',
  'lead.create',
  'lead.read',
  'lead.update',
  'lead.delete',
  'lead.create.own',
  'lead.read.own',
  'lead.update.own',
  'lead.delete.own',
  'requests.create.own',
  'requests.read.own',
  'requests.update.own',
  'requests.delete.own',
  'position_requests.create.own',
  'position_requests.read.own',
  'position_requests.update.own',
  'position_requests.delete.own',
  'roles.create',
  'roles.read',
  'roles.update',
  'roles.delete',
  'residences.create',
  'residences.read',
  'residences.update',
  'residences.delete',
  'residences.create.own',
  'residences.read.own',
  'residences.update.own',
  'residences.delete.own',
  'units.create',
  'units.read',
  'units.update',
  'units.delete',
  'units.create.own',
  'units.read.own',
  'units.update.own',
  'units.delete.own',
  'ranking_categories.create',
  'ranking_categories.read',
  'ranking_categories.update',
  'ranking_categories.delete',
  'ranking_categories.read.own',
  'billing.create',
  'billing.read',
  'billing.update',
  'billing.delete',
  'billing.create.own',
  'billing.read.own',
  'billing.update.own',
  'billing.delete.own',
  'brand.create',
  'brand.read',
  'brand.update',
  'brand.delete',
  'brand_type.create',
  'brand_type.read',
  'brand_type.update',
  'brand_type.delete',
  'media.create',
  'media.read',
  'media.update',
  'media.delete',
  'email.create',
  'email.read',
  'email.update',
  'email.delete',
  'reviews.create',
  'reviews.read',
  'reviews.update',
  'reviews.delete',
  'reviews.create.own',
  'reviews.read.own',
  'reviews.update.own',
  'reviews.delete.own',
  'lifestyles.create',
  'lifestyles.read',
  'lifestyles.update',
  'lifestyles.delete',
  'amenities.create',
  'amenities.read',
  'amenities.update',
  'amenities.delete',
  'ranking_criteria.create',
  'ranking_criteria.read',
  'ranking_criteria.update',
  'ranking_criteria.delete',
  'key_features.create',
  'key_features.read',
  'key_features.update',
  'key_features.delete',
  'companies.create',
  'companies.read',
  'companies.update',
  'companies.delete',
  'companies.create.own',
  'companies.read.own',
  'companies.update.own',
  'companies.delete.own',
  'claim_profile_contact_forms.create',
  'claim_profile_contact_forms.read',
  'claim_profile_contact_forms.update',
  'claim_profile_contact_forms.delete',
  'claim_profile_contact_forms.create.own',
  'claim_profile_contact_forms.read.own',
  'claim_profile_contact_forms.update.own',
  'claim_profile_contact_forms.delete.own',
  'career_contact_forms.create',
  'career_contact_forms.read',
  'career_contact_forms.update',
  'career_contact_forms.delete',
  'b2b_contact_forms.create',
  'b2b_contact_forms.read',
  'b2b_contact_forms.update',
  'b2b_contact_forms.delete',
  'system.superadmin',
  'system.create',
  'system.read',
  'system.update',
  'system.delete',
];

const EXCLUDED_PREFIXES = [
  'users.',
  'units.',
  'billing.',
  'reviews.',
  'brand.',
  'brand_type.',
  'roles.',
  'lifestyles.',
  'amenities.',
  'ranking_categories.',
  'ranking_criteria.',
  'key_features.',
  'companies.',
  'email.',
  'claim_profile_contact_forms.',
  'career_contact_forms.',
  'b2b_contact_forms.',
  'system.',
  'residences.',
];

const managerPermissions = allPermissions.filter((p) => {
  const isOwn = p.endsWith('.own');
  const isExcludedPrefix = EXCLUDED_PREFIXES.some((prefix) => p.startsWith(prefix));
  return isOwn || !isExcludedPrefix;
});

export async function seed(knex: Knex): Promise<void> {
  await knex('role_permissions').del();
  await knex('permissions').del();

  for (const permissionName of allPermissions) {
    const [existing] = await knex('permissions').where({ name: permissionName });

    if (!existing) {
      await knex('permissions').insert({
        id: knex.raw('uuid_generate_v4()'),
        name: permissionName,
      });
    }
  }

  const permissions = await knex('permissions').select('id', 'name');
  const permissionMap = new Map(permissions.map((p) => [p.name, p.id]));

  const insertRolePermissions = async (roleId: string, perms: string[]) => {
    for (const permName of perms) {
      const permissionId = permissionMap.get(permName);

      if (!permissionId) continue;

      const exists = await knex('role_permissions')
        .where({ role_id: roleId, permission_id: permissionId })
        .first();

      if (!exists) {
        await knex('role_permissions').insert({
          role_id: roleId,
          permission_id: permissionId,
        });
      }
    }
  };

  await insertRolePermissions(adminRoleId, [
    'system.superadmin',
    'system.create',
    'system.read',
    'system.update',
    'system.delete',
  ]);
  await insertRolePermissions(managerRoleId, managerPermissions);
}
