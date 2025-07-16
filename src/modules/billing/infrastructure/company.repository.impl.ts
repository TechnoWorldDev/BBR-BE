import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { Company } from '../domain/company.entity';
import { ICompanyRepository } from '../domain/interfaces/company.repository.interface';

@Injectable()
export class CompanyRepositoryImpl implements ICompanyRepository {
  @LogMethod()
  async findById(id: string): Promise<Company | undefined> {
    return await Company.query().findById(id).whereNull('deletedAt');
  }

  @LogMethod()
  async updatePlan(id: string, planId: string): Promise<Company | undefined> {
    return await Company.query().patchAndFetchById(id, { planId }).whereNull('deletedAt');
  }
}
