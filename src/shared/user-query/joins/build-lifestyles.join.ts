import { Knex } from 'knex';

export const buildLifestylesJoin = (knex: Knex) =>
  knex.raw(`
      LATERAL (
        SELECT json_agg(json_build_object('id', ls.id, 'name', ls.name)) AS lifestyles
        FROM user_buyer_lifestyles ub_ls
        JOIN lifestyles ls ON ls.id = ub_ls.lifestyle_id
        WHERE ub_ls.user_id = users.id
      ) lifestyles ON TRUE
    `);
