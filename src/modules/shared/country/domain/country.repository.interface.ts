import { Country } from './country.entity';
import { FetchCountriesQuery } from '../application/commands/fetch-countries.query';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';

export abstract class ICountryRepository {
  abstract create(country: Partial<Country>): Promise<Country | undefined>;
  abstract findById(id: string): Promise<Country | undefined>;
  abstract findAll(
    query: FetchCountriesQuery
  ): Promise<{ data: Country[]; pagination: PaginationResponse }>;
  abstract findAllPublic(
    query: FetchCountriesQuery
  ): Promise<{ data: Country[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<Country | undefined>;
  abstract update(id: string, data: Partial<Country>): Promise<Country | undefined>;
  abstract delete(id: string): Promise<void>;
}
