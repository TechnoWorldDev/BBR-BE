import { Continent } from './continent.entity';
import { PaginationResponse } from '../../../../shared/ui/response/pagination.response';
import { FetchContinentsQuery } from '../application/command/fetch-continents.query';

export abstract class IContinentRepository {
  abstract findById(id: string): Promise<Continent | undefined>;
  abstract findByCode(code: string): Promise<Continent | undefined>;
  abstract findAll(
    query: FetchContinentsQuery
  ): Promise<{ data: Continent[]; pagination: PaginationResponse }>;
  abstract findAllPublic(
    query: FetchContinentsQuery
  ): Promise<{ data: Continent[]; pagination: PaginationResponse }>;
  abstract create(data: Partial<Continent>): Promise<Continent>;
  abstract update(id: string, data: Partial<Continent>): Promise<Continent | undefined>;
  abstract delete(id: string): Promise<void>;
}
