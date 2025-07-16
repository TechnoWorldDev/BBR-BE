import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Lifestyle } from './lifestyle.entity';
import { FetchLifestyleQuery } from '../application/command/fetch-lifestyle.query';

export abstract class ILifestyleRepository {
  abstract create(lifestyle: Partial<Lifestyle>): Promise<Lifestyle | undefined>;
  abstract update(id: string, data: Partial<Lifestyle>): Promise<Lifestyle | undefined>;
  abstract delete(id: string): Promise<any>;
  abstract findAll(
    query: FetchLifestyleQuery
  ): Promise<{ data: Lifestyle[]; pagination: PaginationResponse }>;
  abstract findById(id: string): Promise<Lifestyle | undefined>;
  abstract findByName(name: string): Promise<Lifestyle | undefined>;
}
