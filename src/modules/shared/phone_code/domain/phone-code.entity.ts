import { Model } from 'objection';
import { Country } from '../../country/domain/country.entity';

export class PhoneCode extends Model {
  id!: string;
  code!: string;
  countryId!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
  country: Country

  static tableName = 'phone_codes';

  static relationMappings = {
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Country,
      join: {
        from: 'phone_codes.countryId',
        to: 'countries.id',
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<PhoneCode>): Promise<PhoneCode> {
    return PhoneCode.query().insert(data).returning('*');
  }
}
