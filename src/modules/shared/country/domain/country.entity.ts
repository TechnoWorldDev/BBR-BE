import { Model } from 'objection';
import { Continent } from '../../continent/domain/continent.entity';
import { PhoneCode } from '../../phone_code/domain/phone-code.entity';

export class Country extends Model {
  id!: string;
  name!: string;
  code!: string;
  tld!: string;
  currencyCode!: string;
  currencyName!: string;
  currencySymbol!: string;
  capital!: string;
  phoneCodes!: PhoneCode[];
  subregion!: string;
  flag!: string;
  continent!: Continent;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'countries';

  static relationMappings = {
    continent: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Continent,
      join: {
        from: 'countries.continentId',
        to: 'continents.id',
      },
    },
    phoneCodes: {
      relation: Model.HasManyRelation,
      modelClass: () => PhoneCode,
      join: {
        from: 'countries.id',
        to: 'phone_codes.countryId',
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
}
