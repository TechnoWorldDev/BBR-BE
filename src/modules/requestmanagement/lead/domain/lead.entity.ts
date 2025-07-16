import { Model, RelationMappings } from 'objection';
import { Request } from '../../request/domain/request.entity';
import { LeadStatusEnum } from './lead-status.enum';
import { Residence } from '../../request/domain/residence.entity';

export class Lead extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  status!: LeadStatusEnum;
  phone: string | null;
  preferredContactMethod: string[] | null;
  requests: Request[];

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'leads';

  static relationMappings: RelationMappings = {
    requests: {
      relation: Model.HasManyRelation,
      modelClass: () => Request,
      join: {
        from: 'leads.id',
        to: 'requests.leadId',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
