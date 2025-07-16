import { Residence } from '../domain/residence.entity';

export abstract class IResidenceRepository {
  abstract findById(id: string): Promise<Residence | undefined>;
  abstract findByIds(ids: string[]): Promise<Residence[]>;
  abstract findByIdAndCompanyId(id: string, companyId: string): Promise<Residence | undefined>;
}
