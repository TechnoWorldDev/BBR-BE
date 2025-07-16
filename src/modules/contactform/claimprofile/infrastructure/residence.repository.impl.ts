import { Injectable } from '@nestjs/common';
import { Residence } from '../domain/residence.entity';
import { IResidenceRepository } from '../domain/residence.repository.interface';

@Injectable()
export class ResidenceRepositoryImpl implements IResidenceRepository {
  async findById(id: string): Promise<Residence | undefined> {
    return Residence.query().findById(id).whereNull('deletedAt').whereNull('companyId');
  }
  async assignToCompanyId(id: string, companyId: string): Promise<Residence | undefined> {
    return Residence.query().patchAndFetchById(id, { companyId });
  }
}
