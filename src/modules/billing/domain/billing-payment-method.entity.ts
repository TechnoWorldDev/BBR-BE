import { Model, RelationMappings } from 'objection';
import { StripeCustomer } from './stripe-customer.entity';

export class BillingPaymentMethod extends Model {
  id!: string;
  userId!: string;
  paymentMethodId!: string;
  brand!: string;
  last4!: string;
  expMonth!: number;
  expYear!: number;
  isDefault!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  customer?: StripeCustomer;

  static tableName = 'billing_payment_methods';

  static relationMappings: RelationMappings = {
    customer: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => StripeCustomer,
      join: {
        from: 'billing_payment_methods.userId',
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
