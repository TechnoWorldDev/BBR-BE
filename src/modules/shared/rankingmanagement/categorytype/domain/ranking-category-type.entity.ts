import { Model } from 'objection';

export class RankingCategoryType extends Model {
  id!: string;
  name!: string;
  key!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'ranking_category_types';

  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
