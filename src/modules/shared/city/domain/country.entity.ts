import { Model } from 'objection';

export class Country extends Model {
  id!: string;
  name!: string;
  code!: string;

  static tableName = 'countries';
}
