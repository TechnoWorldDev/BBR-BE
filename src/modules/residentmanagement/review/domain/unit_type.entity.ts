import { Model } from 'objection';

export class UnitType extends Model {
  id!: string;
  name!: string;
  deletedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'unit_types';

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
