import { Model, RelationMappings } from 'objection';
import { UserSubscription } from './user-subscription.entity';
import { BillingTransaction } from './billing-transaction.entity';
import { BillingPaymentMethod } from './billing-payment-method.entity';
import { User } from './user.entity';

export class StripeCustomer extends Model {
  id!: string;
  userId!: string;
  stripeCustomerId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  subscriptions?: UserSubscription[];
  transactions?: BillingTransaction[];
  paymentMethods?: BillingPaymentMethod[];

  static tableName = 'stripe_customers';

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'stripe_customers.userId',
        to: 'users.id',
      },
    },
    subscriptions: {
      relation: Model.HasManyRelation,
      modelClass: () => UserSubscription,
      join: {
        from: 'stripe_customers.userId',
        to: 'billing_subscriptions.userId',
      },
    },
    transactions: {
      relation: Model.HasManyRelation,
      modelClass: () => BillingTransaction,
      join: {
        from: 'stripe_customers.userId',
        to: 'billing_transactions.userId',
      },
    },
    paymentMethods: {
      relation: Model.HasManyRelation,
      modelClass: () => BillingPaymentMethod,
      join: {
        from: 'stripe_customers.userId',
        to: 'billing_payment_methods.userId',
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
