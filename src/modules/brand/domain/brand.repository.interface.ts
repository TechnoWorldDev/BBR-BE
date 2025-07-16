import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchBrandsQuery } from '../application/command/fetch-brands.query';
import { Brand } from './brand.entity';
import { FetchBrandsPublicQuery } from '../application/command/fetch-brands.public.query';

export abstract class IBrandRepository {
  abstract create(brand: Partial<Brand>): Promise<Brand | undefined>;
  abstract findById(id: string): Promise<Brand | undefined>;
  abstract findBySlug(slug: string): Promise<Brand | undefined>;
  abstract findByName(name: string): Promise<Brand | undefined>;
  abstract findAll(
    query: FetchBrandsQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }>;
  abstract findAllPublic(
    query: FetchBrandsPublicQuery
  ): Promise<{ data: Brand[]; pagination: PaginationResponse }>;
  abstract update(id: string, updateData: Partial<Brand>): Promise<Brand | undefined>;
  abstract delete(id: string): Promise<void>;
}
