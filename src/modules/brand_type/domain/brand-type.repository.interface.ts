import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { BrandType } from './brand-type.entity';
import { FetchBrandTypesQuery } from '../application/command/fetch-brand-types.query';

export abstract class IBrandTypesRepository {
  abstract findAll(
    query: FetchBrandTypesQuery
  ): Promise<{ data: BrandType[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<BrandType | undefined>;
  abstract findById(id: string): Promise<BrandType | undefined>;
  abstract create(brandType: Partial<BrandType>): Promise<BrandType>;
  abstract update(id: string, brandType: Partial<BrandType>): Promise<BrandType>;
  abstract delete(id: string): Promise<void>;
}
