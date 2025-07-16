// import { Knex } from 'knex';

// export function buildRoleJoin(knex: Knex) {
//   return knex.raw(`
//     LATERAL (
//       SELECT json_build_object('id', r.id, 'name', r.name)::json AS role
//       FROM roles r
//       WHERE r.id = users.role_id
//     ) role ON TRUE
//   `);
// }

import { Knex } from 'knex';

export function buildRoleJoin(knex: Knex) {
  return knex.raw(`
    LATERAL (
      SELECT json_build_object(
        'id', r.id,
        'name', r.name,
        'description', r.description,
        'permissions', (
          SELECT COALESCE(
            json_agg(DISTINCT p.name)
            FILTER (WHERE p.name IS NOT NULL),
            '[]'
          )
          FROM role_permissions rp
          JOIN permissions p ON p.id = rp.permission_id
          WHERE rp.role_id = r.id
        )
      )::json AS role
      FROM roles r
      WHERE r.id = users.role_id
    ) role ON TRUE
  `);
}
