import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchCompaniesQuery } from '../application/commands/fetch-all-company.query';
import { Company } from './company.entity';

export abstract class ICompanyRepository {
  abstract create(company: any): Promise<any>;
  abstract update(id: string, company: any): Promise<any>;
  abstract delete(id: string): Promise<any>;
  abstract findById(id: string): Promise<any>;
  abstract findAll(
    fetchQuery: FetchCompaniesQuery
  ): Promise<{ data: Company[]; pagination: PaginationResponse }>;
}
