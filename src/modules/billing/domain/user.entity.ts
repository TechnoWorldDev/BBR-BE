import { Model } from 'objection';

export class User extends Model {
  id!: string;
  fullName!: string;
  email!: string;
  companyId!: string;

  static tableName = 'users';
}
