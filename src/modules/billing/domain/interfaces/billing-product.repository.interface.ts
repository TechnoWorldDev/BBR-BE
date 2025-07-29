import { BillingProduct } from '../billing-product.entity';

export abstract class IBillingProductRepository {
  abstract create(billingProduct: Partial<BillingProduct>): Promise<BillingProduct>;
  abstract findByBillingPriceId(priceId: string): Promise<BillingProduct | undefined>;
  abstract findByFeatureKey(key: string): Promise<BillingProduct | undefined>;
  abstract getActiveProducts(): Promise<BillingProduct[]>;
  abstract findBySubscriptionType(): Promise<BillingProduct[]>;
  // New methods for subscription system
  abstract findById(id: string): Promise<BillingProduct | undefined>;
  // New method for filtered products
  abstract findFilteredProducts(filters?: {
    type?: string;
    active?: boolean;
    isPremium?: boolean;
  }): Promise<BillingProduct[]>;
  // New method for finding active product by feature key
  abstract findActiveProductByFeatureKey(key: string): Promise<BillingProduct | undefined>;
}
