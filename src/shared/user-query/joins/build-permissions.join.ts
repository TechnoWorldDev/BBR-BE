import { Knex } from 'knex';

export const buildPermissionsJoin = (knex: Knex) =>
  knex.raw(`
    LATERAL (
      SELECT json_agg(DISTINCT p.name) AS permissions
      FROM users u2
      JOIN roles r ON u2.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE u2.id = users.id
    ) permissions ON TRUE
  `);
