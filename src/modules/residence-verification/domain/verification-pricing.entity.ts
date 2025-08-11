import { Model } from 'objection';

export class VerificationPricing extends Model {
  id!: string;
  verificationType!: string;
  price!: number;
  currency!: string;
  description?: string;
  stripePriceId?: string;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'verification_pricing';

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
