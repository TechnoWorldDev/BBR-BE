import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data before seeding
  await knex('users').del();
  await knex('companies').del();

  const roles = await knex('roles').select('id', 'name');
  const superAdminRole = roles.find((role) => role.name === 'superadmin')?.id;
  const adminRole = roles.find((role) => role.name === 'admin')?.id;
  const developerRole = roles.find((role) => role.name === 'developer')?.id;
  const buyerRole = roles.find((role) => role.name === 'buyer')?.id;

  const developerUserId = uuidv4();

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Insert seed data
  await knex('users').insert([
    {
      id: uuidv4(),
      full_name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: superAdminRole,
      status: 'ACTIVE',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      full_name: 'Residence Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: adminRole,
      status: 'ACTIVE',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: developerUserId,
      full_name: 'Developer Peter',
      email: 'developer@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: developerRole,
      status: 'ACTIVE',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      full_name: 'Buyer Smith',
      email: 'buyer@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: buyerRole,
      status: 'ACTIVE',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  const companyId = uuidv4();

  await knex('companies').insert({
    id: companyId,
    name: 'Awesome Dev Company',
    image_id: null,
    address: 'Silicon Valley',
    phone_number: '+381112223344',
    phone_number_country_code: '+381',
    website: 'https://inity.agency',
    contact_person_avatar_id: null,
    contact_person_full_name: 'Nikola Marković',
    contact_person_job_title: 'CTO',
    contact_person_email: 'nikola@inity.agency',
    contact_person_phone_number: '+381641234567',
    contact_person_phone_number_country_code: '+381',
    created_at: new Date(),
    updated_at: new Date(),
  });

  await knex('users').where({ id: developerUserId }).update({ company_id: companyId });
}
