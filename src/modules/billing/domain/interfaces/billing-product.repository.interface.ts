import { BillingProduct } from '../billing-product.entity';

export abstract class IBillingProductRepository {
  abstract create(billingProduct: Partial<BillingProduct>): Promise<BillingProduct>;
  abstract findByBillingPriceId(priceId: string): Promise<BillingProduct | undefined>;
  abstract findByFeatureKey(key: string): Promise<BillingProduct | undefined>;
  abstract getActiveProducts(): Promise<BillingProduct[]>;
}
