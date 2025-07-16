import { Plan } from 'src/modules/plan/domain/plan.entity';
import { PlanResponse } from '../response/plan.response';

export class PlanMapper {
  static toResponse(plan: Plan): PlanResponse {
    return new PlanResponse(plan.id, plan.name, plan.code, plan.description);
  }
}
