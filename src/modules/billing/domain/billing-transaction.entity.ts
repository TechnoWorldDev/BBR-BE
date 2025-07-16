import { Model, RelationMappings } from 'objection';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { StripeCustomer } from './stripe-customer.entity';
import { User } from './user.entity';

export class BillingTransaction extends Model {
  id!: string;
  userId!: string;
  stripePaymentIntentId!: string;
  stripeInvoiceId?: string;
  stripeProductId!: string;
  stripePriceId!: string;
  stripeHostingInvoiceUrl!: string;
  type!: BillingProductTypeEnum;
  amount!: number;
  currency!: string;
  status!: string;
  createdAt!: Date;
  updatedAt!: Date;

  customer?: StripeCustomer;

  static tableName = 'billing_transactions';

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => User,
      join: {
        from: 'billing_transactions.userId',
        to: 'users.id',
      },
    },
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => StripeCustomer,
      join: {
        from: 'billing_transactions.userId',
        to: 'stripe_customers.userId',
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
