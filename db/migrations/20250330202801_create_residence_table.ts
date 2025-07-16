import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residences', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('status').notNullable().defaultTo('DRAFT');
    table.string('name').notNullable();
    table.string('slug').notNullable().unique().index();
    table.string('website_url').nullable();
    table.string('subtitle').nullable();
    table.text('description').nullable();
    table.bigInteger('budget_start_range').nullable();
    table.bigInteger('budget_end_range').nullable();
    table.string('address').nullable();
    table.double('latitude').nullable();
    table.double('longitude').nullable();
    table.string('year_built').nullable();
    table
      .enum('development_status', ['COMPLETED', 'UNDER_CONSTRUCTION', 'PLANNED'])
      .notNullable()
      .defaultTo('PLANNED');
    table.decimal('floor_sqft', 10, 2).nullable();
    table.integer('staff_ratio').nullable();
    table.decimal('avg_price_per_unit', 15, 2).nullable();
    table.decimal('avg_price_per_sqft', 15, 2).nullable();
    table.enum('rental_potential', ['HIGH', 'MEDIUM', 'LOW']).nullable();
    table.boolean('pet_friendly').notNullable().defaultTo(false);
    table.boolean('disabled_friendly').notNullable().defaultTo(false);
    table.string('video_tour_url').nullable();

    table.uuid('featured_image_id').references('id').inTable('media').onDelete('SET NULL');

    table.uuid('brand_id').references('id').inTable('brands').onDelete('SET NULL');

    table.uuid('country_id').references('id').inTable('countries').onDelete('SET NULL');

    table.uuid('city_id').references('id').inTable('cities').onDelete('SET NULL');

    table.uuid('video_tour_id').references('id').inTable('media').onDelete('SET NULL');

    table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL');

    table.timestamps(true, true);

    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residences');
}
