import { Model } from 'objection';
import { Company } from 'src/modules/company/domain/company.entity';

export class User extends Model {
  id!: string;
  fullName!: string;
  email!: string;
  companyId!: string;

  company: Company;

  static tableName = 'users';

  static relationMappings = () => ({
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Company,
      join: {
        from: 'users.companyId',
        to: 'companies.id',
      },
    },
  });
}
