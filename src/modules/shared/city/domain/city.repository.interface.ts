import { City } from './city.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchCitiesQuery } from '../application/commands/fetch-cities.query';

export abstract class ICityRepository {
  abstract create(city: Partial<City>): Promise<City | undefined>;
  abstract findById(id: string): Promise<City | undefined>;
  abstract findAll(
    fetchQuery: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }>;
  abstract findAllPublic(
    fetchQuery: FetchCitiesQuery
  ): Promise<{ data: City[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<City | undefined>;
  abstract update(id: string, data: Partial<City>): Promise<City | undefined>;
  abstract delete(id: string): Promise<void>;
}
