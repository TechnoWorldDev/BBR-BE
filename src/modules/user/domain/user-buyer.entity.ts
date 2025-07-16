import { Model, RelationMappings } from 'objection';
import { Lifestyle } from 'src/modules/lifestyles/domain/lifestyle.entity';
import { UnitType } from 'src/modules/residentmanagement/unit_type/domain/unit_type.entity';
import { Country } from 'src/modules/shared/country/domain/country.entity';

export class UserBuyer extends Model {
  userId!: string;
  avatar?: string;
  currentLocation?: string;
  budgetRangeFrom?: string;
  budgetRangeTo?: string;
  phoneNumber?: string;
  phoneNumberCountryCode?: string;
  preferredContactMethod?: string;
  preferredResidenceLocation?: string;
  lifestyles?: Lifestyle[];
  unitTypes: UnitType[];
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'user_buyers';

  static relationMappings: RelationMappings = {
    currentLocation: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'user_buyers.currentLocation',
        to: 'countries.id',
      },
    },
    unitTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: () => UnitType,
      join: {
        from: 'user_buyers.user_id',
        through: {
          from: 'user_buyer_unit_types.user_id',
          to: 'user_buyer_unit_types.unit_type_id',
        },
        to: 'unit_types.id',
      },
    },
    lifestyles: {
      relation: Model.ManyToManyRelation,
      modelClass: () => Lifestyle,
      join: {
        from: 'user_buyers.user_id',
        through: {
          from: 'user_buyer_lifestyles.user_id',
          to: 'user_buyer_lifestyles.lifestyle_id',
        },
        to: 'lifestyles.id',
      },
    },
    preferredResidenceLocation: {
      relation: Model.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'user_buyers.preferredResidenceLocation',
        to: 'countries.id',
      },
    },
  };

  async $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
