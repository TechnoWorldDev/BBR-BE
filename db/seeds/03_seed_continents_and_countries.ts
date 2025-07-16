import { Knex } from 'knex';
import * as fs from 'fs';
import * as csv from 'csv-parser';

interface CountryCSV {
  name: string;
  countryCode: string;
  tld: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  capital: string;
  phoneCode: string;
  region: string;
  subRegion: string;
  flag: string;
  continentName: string;
}

async function parseCSV(filePath: string): Promise<CountryCSV[]> {
  return new Promise((resolve, reject) => {
    const results: CountryCSV[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as CountryCSV))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

export async function seed(knex: Knex): Promise<void> {
  const filePath = `${__dirname}/../csv/GeoData - Countries.csv`;
  const countries = await parseCSV(filePath);

  await knex('cities').del();
  await knex('phone_codes').del();
  await knex('countries').del();
  await knex('continents').del();

  const continents = [
    { name: 'Africa', code: 'AF' },
    { name: 'Antarctica', code: 'AN' },
    { name: 'Asia', code: 'AS' },
    { name: 'Europe', code: 'EU' },
    { name: 'North America', code: 'NA' },
    { name: 'Oceania', code: 'OC' },
    { name: 'South America', code: 'SA' },
    { name: 'Worldwide', code: 'WORLDWIDE' },
  ];

  const insertedContinents = await knex('continents')
    .insert(
      continents.map(({ name, code }) => ({
        id: knex.raw('uuid_generate_v4()'),
        name,
        code,
      }))
    )
    .returning(['id', 'name']);

  const continentMap = Object.fromEntries(insertedContinents.map((c) => [c.name, c.id]));

  const formattedCountries = countries.map((country) => ({
    id: knex.raw('uuid_generate_v4()'),
    name: country.name,
    code: country.countryCode || 'UNKNOWN_CODE',
    tld: country.tld,
    currency_code: country.currencyCode || 'UNKNOWN_CODE',
    currency_name: country.currencyName || 'UNKNOWN_NAME',
    currency_symbol: country.currencySymbol || 'UNKNOWN_SYMBOL',
    capital: country.capital,
    subregion: country.subRegion || 'UNKNOWN_SUBREGION',
    flag: country.flag,
    continent_id: continentMap[country.continentName],
  }));

  const insertedCountries = await knex('countries').insert(formattedCountries).returning(['id']);

  const phoneCodes = insertedCountries.flatMap((country, index) => {
    const phoneCodeList = countries[index].phoneCode
      .split(',')
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    return phoneCodeList.map((code) => ({
      id: knex.raw('uuid_generate_v4()'),
      code: code,
      countryId: country.id,
    }));
  });

  await knex('phone_codes').insert(phoneCodes);
}
