import { Amenity } from './amenity.entity';
import { FetchAmenitiesQuery } from '../application/commands/fetch-amenities.query';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';

export abstract class IAmenityRepository {
  abstract create(amenity: Partial<Amenity>): Promise<Amenity | undefined>;
  abstract findById(id: string): Promise<Amenity | undefined>;
  abstract findAll(
    query: FetchAmenitiesQuery
  ): Promise<{ data: Amenity[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<Amenity | undefined>;
  abstract update(id: string, data: Partial<Amenity>): Promise<Amenity | undefined>;
  abstract delete(id: string): Promise<void>;
  abstract validateAndFetchByIds(ids: string[]): Promise<Amenity[]>;
}
