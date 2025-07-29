import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { Model, RelationMappings } from 'objection';
import { SubscriptionType } from './subscription-type.entity';

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
  isPremium!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  // New fields for subscription system
  subscriptionTypeId?: string; // Optional for one-time products
  metadata?: any; // JSON metadata for additional information

  subscriptionType?: SubscriptionType;

  static tableName = 'billing_products';

  static relationMappings: RelationMappings = {
    subscriptionType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => SubscriptionType,
      join: {
        from: 'billing_products.subscriptionTypeId',
        to: 'subscription_types.id',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
