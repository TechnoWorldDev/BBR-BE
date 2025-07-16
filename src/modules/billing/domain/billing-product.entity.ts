import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { Model } from 'objection';

export class BillingProduct extends Model {
  id!: string;
  name!: string;
  description!: string;
  featureKey!: string;
  type!: BillingProductTypeEnum;
  stripeProductId!: string;
  stripePriceId!: string;
  active!: boolean;
  amount!: number;
  currency!: string;
  interval!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'billing_products';

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
