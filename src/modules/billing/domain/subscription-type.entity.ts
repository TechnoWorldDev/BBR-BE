import { Model, RelationMappings } from 'objection';
import { UserSubscription } from './user-subscription.entity';

export class SubscriptionType extends Model {
  id!: string;
  name!: string; // 'residence', 'ranking'
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;

  subscriptions?: UserSubscription[];

  static tableName = 'subscription_types';

  static relationMappings: RelationMappings = {
    subscriptions: {
      relation: Model.HasManyRelation,
      modelClass: () => UserSubscription,
      join: {
        from: 'subscription_types.id',
        to: 'billing_subscriptions.subscriptionTypeId',
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