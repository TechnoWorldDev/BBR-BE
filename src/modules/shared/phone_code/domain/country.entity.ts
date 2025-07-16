import { Model } from 'objection';

export class Country extends Model {
  id!: string;
  name!: string;
  image!: string;

  static tableName = 'countries';
}
