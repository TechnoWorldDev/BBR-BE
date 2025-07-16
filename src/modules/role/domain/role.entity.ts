import { Model } from 'objection';

export class Role extends Model {
  id!: string;
  name!: string;
  description!: string;
  permissions?: string[];
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'roles';

  static create(name: string, description: string): Role {
    return Role.fromJson({ name, description });
  }
}
