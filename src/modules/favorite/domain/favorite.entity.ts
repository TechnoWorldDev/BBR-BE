import { Model } from 'objection';

export class Favorite extends Model {
  id!: string;
  userId!: string;
  entityType!: string; // e.g. 'residence', 'unit'
  entityId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  entity?: any;

  // No hard relations — resolution is dynamic
  static tableName = 'favorites';

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
