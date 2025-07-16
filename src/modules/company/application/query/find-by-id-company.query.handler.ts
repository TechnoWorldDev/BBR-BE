import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from 'src/modules/company/domain/company.entity';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class FindByIdCompanyQueryHandler {
  constructor(public readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handle(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    return company;
  }
}
