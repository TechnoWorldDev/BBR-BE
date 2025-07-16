import { Knex } from 'knex';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { chunk } from 'lodash';

interface CityCSV {
  name: string;
  asciiName: string;
  countryCode: string;
  countryName: string;
  population: number;
  timezone: string;
  coordinates: string;
}

async function parseCSV(filePath: string): Promise<CityCSV[]> {
  return new Promise((resolve, reject) => {
    const results: CityCSV[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as CityCSV))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export async function seed(knex: Knex): Promise<void> {
  const filePath = `${__dirname}/../csv/GeoData - Cities.csv`;  
  const cities = await parseCSV(filePath);

  await knex('cities').del();  

  const countries = await knex('countries').select('id', 'code');
  const countryMap = Object.fromEntries(countries.map(c => [c.code, c.id]));  

  const formattedCities = cities
  .map((city) => {
    const countryId = countryMap[city.countryCode];

    if (!countryId) return null; 

    const [xCoordinate, yCoordinate] = city.coordinates.split(',').map(coord => coord.trim());

    return {
      id: knex.raw('uuid_generate_v4()'),
      name: city.name,
      asciiName: city.asciiName,
      countryId,
      population: city.population,
      timezone: city.timezone,
      xCoordinate: parseFloat(xCoordinate),
      yCoordinate: parseFloat(yCoordinate),
      createdAt: knex.fn.now(),
      updatedAt: knex.fn.now(),
    };
  })
  .filter(city => city !== null); 

  const batchSize = 1000;
  const cityChunks = chunk(formattedCities, batchSize);

  for (const batch of cityChunks) {
    await knex('cities').insert(batch);
  }
}
