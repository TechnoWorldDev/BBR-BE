import { Model, RelationMappings } from 'objection';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { ResidenceStatusEnum } from '../../residence/domain/residence-status.enum';
import { Company } from '../../residence/domain/company.entity';

export class Residence extends Model {
  id!: string;
  name!: string;
  status!: ResidenceStatusEnum;
  developmentStatus!: DevelopmentStatusEnum;
  subtitle!: string;
  description!: string;
  budgetStartRange!: number;
  budgetEndRange!: number;
  address!: string;
  longitude!: string;
  latitude!: string;

  company: Company;

  static relationMappings: RelationMappings = {
    company: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Company,
      join: {
        from: 'residences.companyId',
        to: 'companies.id',
      },
    },
  };

  static tableName = 'residences';
}
