import { Model } from 'objection';
import { Country } from './country.entity';

export class City extends Model {
  id!: string;
  name!: string;
  asciiName!: string;
  population!: number;
  timezone!: string;
  xCoordinate!: string;
  yCoordinate!: string;
  createdAt!: Date;
  updatedAt!: Date;

  countryId?: string;
  country: Country;

  static tableName = 'cities';

  static relationMappings = {
    country: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Country,
      join: {
        from: 'cities.countryId',
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
}
