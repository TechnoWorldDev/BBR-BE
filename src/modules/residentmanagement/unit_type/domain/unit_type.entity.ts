import { Model } from 'objection';

export class UnitType extends Model {
  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'unit_types';

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<UnitType>): Promise<UnitType> {
    return UnitType.query().insert(data).returning('*');
  }
}
