import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { BillingProduct } from './billing-product.entity';
import { StripeCustomer } from './stripe-customer.entity';
import { Model, RelationMappings } from 'objection';
import { Plan } from 'src/modules/plan/domain/plan.entity';
import { Residence } from 'src/modules/residentmanagement/residence/domain/residence.entity';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';
import { SubscriptionType } from './subscription-type.entity';

export class UserSubscription extends Model {
  id!: string;
  userId!: string;
  productId!: string;
  subscriptionId!: string;
  currentPeriodEnd!: Date;
  status!: SubscriptionStatusEnum;
  createdAt!: Date;
  updatedAt!: Date;

  // New fields for two-tier subscription system
  subscriptionTypeId!: string;
  residenceId!: string;
  rankingCategoryId?: string; // Optional for residence subscriptions
  metadata?: any; // JSON metadata for additional information

  product?: BillingProduct;
  customer?: StripeCustomer;
  residence?: Residence;
  rankingCategory?: RankingCategory;
  subscriptionType?: SubscriptionType;

  static tableName = 'billing_subscriptions';

  static relationMappings: RelationMappings = {
    product: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => BillingProduct,
      join: {
        from: 'billing_subscriptions.productId',
        to: 'billing_products.id',
      },
    },
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => StripeCustomer,
      join: {
        from: 'billing_subscriptions.userId',
        to: 'stripe_customers.userId',
      },
    },
    plan: {
      relation: Model.BelongsToOneRelation,
      modelClass: Plan,
      join: {
        from: 'billing_subscriptions.productId',
        to: 'plans.product_id',
      },
    },
    residence: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Residence,
      join: {
        from: 'billing_subscriptions.residenceId',
        to: 'residences.id',
      },
    },
    rankingCategory: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => RankingCategory,
      join: {
        from: 'billing_subscriptions.rankingCategoryId',
        to: 'ranking_categories.id',
      },
    },
    subscriptionType: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => SubscriptionType,
      join: {
        from: 'billing_subscriptions.subscriptionTypeId',
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
