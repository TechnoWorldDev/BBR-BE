export async function up(knex) {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').unique().notNullable();
    table.string('description').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').unique().notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('role_permissions', (table) => {
    table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.uuid('permission_id').references('id').inTable('permissions').onDelete('CASCADE');
    table.primary(['role_id', 'permission_id']);
  });

  await knex.schema.createTable('abac_rules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable().unique();
    table.jsonb('conditions').notNullable(); // Stores JSON conditions
    table.timestamps(true, true);
  });

  await knex.schema.alterTable('users', (table) => {
    table.uuid('role_id').references('id').inTable('roles').onDelete('SET NULL');
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('abac_rules');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role_id');
  });
}
