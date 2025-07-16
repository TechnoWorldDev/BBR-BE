import { Model } from 'objection';

export class Continent extends Model {
  id!: string;
  name!: string;
  code!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'continents';

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<Continent>): Promise<Continent> {
    return Continent.query().insert(data).returning('*');
  }
}
