import { Injectable } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchCompaniesQuery } from '../commands/fetch-all-company.query';

@Injectable()
export class FetchAllCompanyQueryHandler {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handle(
    query: FetchCompaniesQuery
  ): Promise<{ data: Company[]; pagination: PaginationResponse }> {
    const result = await this.companyRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
