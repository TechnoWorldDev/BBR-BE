import { Knex } from 'knex';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { chunk } from 'lodash';

interface BrandCSV {
  brandName: string;
  brandDescription: string;
  brandType: string;
}

async function parseCSV(filePath: string): Promise<BrandCSV[]> {
  return new Promise((resolve, reject) => {
    const results: BrandCSV[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as BrandCSV))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export async function seed(knex: Knex): Promise<void> {
  const filePath = `${__dirname}/../csv/Brands Management_Data.csv`;
  const brands = await parseCSV(filePath);

  await knex('brands').del(); // Delete all existing records

  const brandTypes = await knex('brand_types').select('id', 'name');
  const brandTypeMap = Object.fromEntries(brandTypes.map((bt) => [bt.name, bt.id]));

  const formattedBrands = brands
    .map((brand) => {
      const brandTypeId = brandTypeMap[brand.brandType];

      if (!brandTypeId) return null; // Skip brands with unknown brand types

      const slug = brand.brandName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      return {
        id: knex.raw('uuid_generate_v4()'),
        name: brand.brandName,
        slug,
        description: brand.brandDescription,
        brandTypeId,
        createdAt: knex.fn.now(),
        updatedAt: knex.fn.now(),
      };
    })
    .filter((brand) => brand !== null);

  const batchSize = 1000;
  const brandChunks = chunk(formattedBrands, batchSize);

  for (const batch of brandChunks) {
    await knex('brands').insert(batch);
  }
}
