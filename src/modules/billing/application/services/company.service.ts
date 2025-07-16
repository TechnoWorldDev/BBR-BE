import { Plan } from 'src/modules/plan/domain/plan.entity';
import { Company } from '../../domain/company.entity';

export class CompanyService {
  constructor() {}

  async updatePlan(companyId: string, productId: string) {
    const plan = await Plan.query().findOne({ productId: productId });

    if (!plan) return;

    await Company.query().patch({ planId: plan.id }).where('id', companyId);
  }
}
