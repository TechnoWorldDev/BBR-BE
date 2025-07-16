import { Company } from '../company.entity';

export abstract class ICompanyRepository {
  abstract findById(id: string): Promise<Company | undefined>;
  abstract updatePlan(id: string, planId: string): Promise<Company | undefined>;
}
