import { Country } from './country.entity';

export abstract class ICountryRepository {
  abstract findById(id: string): Promise<Country | undefined>;
}
