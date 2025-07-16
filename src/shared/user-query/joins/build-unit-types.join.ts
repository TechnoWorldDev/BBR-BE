import { Knex } from 'knex';

export const buildUnitTypesJoin = (knex: Knex) =>
  knex.raw(`
      LATERAL (
        SELECT json_agg(json_build_object('id', ut.id, 'name', ut.name)) AS unit_types
        FROM user_buyer_unit_types ub_ut
        JOIN unit_types ut ON ut.id = ub_ut.unit_type_id
        WHERE ub_ut.user_id = users.id
      ) unitTypes ON TRUE
    `);
