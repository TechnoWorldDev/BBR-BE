import { Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteCompanyCommandHandler {
  constructor(private readonly companyRepository: ICompanyRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException(`Company not found`);
    }

    await this.companyRepository.delete(id);
  }
}
