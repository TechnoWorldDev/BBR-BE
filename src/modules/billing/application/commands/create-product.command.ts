import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';
import { SubscriptionIntervalEnum } from 'src/shared/types/subscription-interval.enum';

export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly featureKey: string,
    public readonly type: BillingProductTypeEnum,
    public readonly amount: number,
    public readonly currency: string,
    public readonly description?: string,
    public readonly interval?: SubscriptionIntervalEnum
  ) {}
}
