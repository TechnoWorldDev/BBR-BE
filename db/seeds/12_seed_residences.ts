import { Knex } from 'knex';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { chunk } from 'lodash';

import { RentalPotentialEnum } from './../../src/shared/types/rental-potential.enum';
import { DevelopmentStatusEnum } from './../../src/shared/types/development-status.enum';
import { randomUUID } from 'crypto';

interface ResidenceCSV {
  residence_name: string;
  website_url: string;
  avg_price_per_unit: number;
  avg_price_per_sqft: number;
  budget_start_range: number;
  budget_end_range: number;
  floor_area_sqft: number;
  no_of_units: number;
  build_year: number;
  development_status: string;
  rental_potential: string;
  pet_friendly: string;
  accessible: string;
  city: string;
  country: string;
  associated_brand: string;
  brief_subtitle: string;
  brief_description: string;
  feature_names: string;
  amenity_names: string;
  highlighted_amenity1: string;
  highlighted_amenity2: string;
  highlighted_amenity3: string;
  address: string;
}

async function parseCSV(filePath: string): Promise<ResidenceCSV[]> {
  const allowedKeys = [
    'residence_name',
    'website_url',
    'avg_price_per_unit',
    'avg_price_per_sqft',
    'budget_start_range',
    'budget_end_range',
    'floor_area_sqft',
    'no_of_units',
    'build_year',
    'development_status',
    'rental_potential',
    'pet_friendly',
    'accessible',
    'city',
    'country',
    'associated_brand',
    'brief_subtitle',
    'brief_description',
    'feature_names',
    'amenity_names',
    'highlighted_amenity1',
    'highlighted_amenity2',
    'highlighted_amenity3',
    'address',
  ];

  return new Promise((resolve, reject) => {
    const results: ResidenceCSV[] = [];
    fs.createReadStream(filePath)
      // .pipe(csv({ headers: true, skipLines: 1, mapHeaders: ({ header }) => header.trim() }))
      // .on('data', (data) => results.push(data as ResidenceCSV))
      .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
      .on('data', (row) => {
        const cleanedRow: ResidenceCSV = {
          residence_name: row['residence_name'] ?? '',
          website_url: row['website_url'] ?? '',
          avg_price_per_unit: Number(row['avg_price_per_unit']) || 0,
          avg_price_per_sqft: Number(row['avg_price_per_sqft']) || 0,
          budget_start_range: Number(row['budget_start_range']) || 0,
          budget_end_range: Number(row['budget_end_range']) || 0,
          floor_area_sqft: Number(row['floor_area_sqft']) || 0,
          no_of_units: Number(row['no_of_units']) || 0,
          build_year: Number(row['build_year']) || 0,
          development_status: row['development_status'] ?? '',
          rental_potential: row['rental_potential'] ?? '',
          pet_friendly: row['pet_friendly'] ?? '',
          accessible: row['accessible'] ?? '',
          city: row['city'] ?? '',
          country: row['country'] ?? '',
          associated_brand: row['associated_brand'] ?? '',
          brief_subtitle: row['brief_subtitle'] ?? '',
          brief_description: row['brief_description'] ?? '',
          feature_names: row['feature_names'] ?? '',
          amenity_names: row['amenity_names'] ?? '',
          highlighted_amenity1: row['highlighted_amenity1'] ?? '',
          highlighted_amenity2: row['highlighted_amenity2'] ?? '',
          highlighted_amenity3: row['highlighted_amenity3'] ?? '',
          address: row['address'] ?? '',
        };

        results.push(cleanedRow);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function toNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export async function seed(knex: Knex): Promise<void> {
  // const filePath = `${__dirname}/../csv/residences_seed_1_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_2_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_3_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_4_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_5_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_6_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_7_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_8_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_9_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_12_new.csv`;
  const filePath = `${__dirname}/../csv/residences_seed_13_new.csv`;
  // const filePath = `${__dirname}/../csv/residences_seed_test.csv`;
  const residences = await parseCSV(filePath);

  // Deletes ALL existing entries
  // await knex('residences').del();

  const brands = await knex('brands').select('id', 'name');
  const city = await knex('cities').select('id', 'name');
  const country = await knex('countries').select('id', 'name');
  const keyFeatures = await knex('key_features').select('id', 'name');
  const amenities = await knex('amenities').select('id', 'name');
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]));
  const cityMap = Object.fromEntries(city.map((c) => [c.name, c.id]));
  const countryMap = Object.fromEntries(country.map((c) => [c.name, c.id]));

  const matchRentalPotential = (value: string): RentalPotentialEnum | undefined => {
    return Object.values(RentalPotentialEnum).find(
      (enumVal) => enumVal.toLowerCase() === value.toLowerCase()
    );
  };

  const matchDevelopmentStatus = (value: string): DevelopmentStatusEnum | undefined => {
    return Object.values(DevelopmentStatusEnum).find(
      (enumVal) => enumVal.toLowerCase() === value.toLowerCase()
    );
  };

  const normalize = (str: string) =>
    str
      .trim()
      .toLowerCase()
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ');

  const keyFeatureMap = new Map(keyFeatures.map((kf) => [normalize(kf.name), kf.id]));

  const amenityMap = new Map(amenities.map((a) => [normalize(a.name), a.id]));

  const formattedResidences: any[] = [];
  const keyFeatureRelations: { residenceId: string; features: string }[] = [];
  const amenityRelations: { residenceId: string; amenities: string }[] = [];
  const highlightedAmenityRelations: {
    residenceId: string;
    amenityNames: { name: string; order: number }[];
  }[] = [];

  for (const residence of residences) {
    const brandId = brandMap[residence.associated_brand];
    const cityId = cityMap[residence.city];
    const countryId = countryMap[residence.country];
    let slug = residence.residence_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const existingResidence =
      formattedResidences.find((res) => res.slug === slug) ||
      (await knex('residences').where('slug', slug).first());
    if (existingResidence) {
      slug += `-${Math.random().toString(36).substring(2, 7)}`;
    }

    if (!brandId) continue;

    const id = randomUUID();

    formattedResidences.push({
      id,
      name: residence.residence_name,
      slug: slug,
      websiteUrl: residence.website_url,
      brandId,
      subtitle: residence.brief_subtitle,
      description: residence.brief_description,
      avgPricePerUnit: toNumber(residence.avg_price_per_unit),
      avgPricePerSqft: toNumber(residence.avg_price_per_sqft),
      budgetStartRange: toNumber(residence.budget_start_range),
      budgetEndRange: toNumber(residence.budget_end_range),
      yearBuilt: residence.build_year.toString(),
      rentalPotential: matchRentalPotential(residence.rental_potential),
      developmentStatus: matchDevelopmentStatus(residence.development_status),
      floorSqft: toNumber(residence.floor_area_sqft),
      petFriendly: residence.pet_friendly === 'yes',
      disabledFriendly: residence.accessible === 'yes',
      address: residence.address,
      latitude: 0.0,
      longitude: 0.0,
      cityId,
      countryId,
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    });

    keyFeatureRelations.push({
      residenceId: id,
      features: residence.feature_names || '',
    });

    amenityRelations.push({
      residenceId: id,
      amenities: residence.amenity_names || '',
    });

    highlightedAmenityRelations.push({
      residenceId: id,
      amenityNames: [
        residence.highlighted_amenity1,
        residence.highlighted_amenity2,
        residence.highlighted_amenity3,
      ]
        .map((name, index) => ({ name, order: index + 1 }))
        .filter(Boolean),
    });
  }

  const batchSize = 500;
  const residenceChunks = chunk(formattedResidences, batchSize);
  for (const batch of residenceChunks) {
    await knex('residences').insert(batch);
  }

  for (const relation of keyFeatureRelations) {
    const parts = relation.features
      .split(',')
      .map((f) => normalize(f))
      .filter(Boolean);

    const matchedIds = parts.map((p) => keyFeatureMap.get(p)).filter(Boolean);

    if (matchedIds.length) {
      await knex('residence_key_feature_relations').insert(
        matchedIds.map((keyFeatureId) => ({
          residence_id: relation.residenceId,
          key_feature_id: keyFeatureId,
        }))
      );
    }
  }

  for (const relation of highlightedAmenityRelations) {
    const inserts = relation.amenityNames
      .map(({ name, order }) => {
        const amenityId = amenityMap.get(normalize(name));
        if (!amenityId) return null;

        return {
          residenceId: relation.residenceId,
          amenityId,
          order,
        };
      })
      .filter(Boolean);

    if (inserts.length) {
      await knex('residence_highlighted_amenities').insert(inserts);
    }
  }

  for (const relation of amenityRelations) {
    const parts = relation.amenities
      .split(',')
      .map((a) => normalize(a))
      .filter(Boolean);

    const matchedIds = parts.map((p) => amenityMap.get(p)).filter(Boolean);

    if (matchedIds.length) {
      await knex('residence_amenity_relations').insert(
        matchedIds.map((amenityId) => ({
          residence_id: relation.residenceId,
          amenity_id: amenityId,
        }))
      );
    }
  }
}
