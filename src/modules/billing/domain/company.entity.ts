import { Model, RelationMappings } from 'objection';
import { Plan } from 'src/modules/plan/domain/plan.entity';

export class Company extends Model {
  id: string;
  name: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  planId?: string;
  plan?: Plan;

  static tableName = 'companies';

  static relationMappings: RelationMappings = {
    plan: {
      relation: Model.BelongsToOneRelation,
      modelClass: Plan,
      join: {
        from: 'companies.planId',
        to: 'plans.id',
      },
    },
  };

  static async create(data: Partial<Company>): Promise<Company> {
    return await Company.query().insert(data).returning('*');
  }
}
