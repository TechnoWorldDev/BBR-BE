import { Model, RelationMappings } from 'objection';
import { UserSubscription } from 'src/modules/billing/domain/user-subscription.entity';

export class Plan extends Model {
  id!: string;
  productId!: number;
  code!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static tableName = 'plans';

  static relationMappings: RelationMappings = {
    subscriptions: {
      relation: Model.HasManyRelation,
      modelClass: () => UserSubscription,
      join: {
        from: 'plans.productId',
        to: 'billing_subscriptions.productId',
      },
    },
  };
}
