import { Model, RelationMappings } from 'objection';
import { Media } from 'src/modules/media/domain/media.entity';

export class Lifestyle extends Model {
  id!: string;
  order!: number;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;

  static tableName = 'lifestyles';

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static async create(data: Partial<Lifestyle>): Promise<Lifestyle> {
    return Lifestyle.query().insert(data).returning('*');
  }
}
