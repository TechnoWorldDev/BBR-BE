import { Residence } from '../domain/residence.entity';

export abstract class IResidenceRepository {
  abstract findById(id: string): Promise<Residence | undefined>;
  abstract assignToCompanyId(id: string, companyId: string): Promise<Residence | undefined>;
}
