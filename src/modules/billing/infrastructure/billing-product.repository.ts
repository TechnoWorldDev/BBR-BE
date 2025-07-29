import { Injectable } from '@nestjs/common';
import { BillingProduct } from '../domain/billing-product.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { IBillingProductRepository } from '../domain/interfaces/billing-product.repository.interface';

@Injectable()
export class BillingProductRepositoryImpl implements IBillingProductRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(billingProduct: Partial<BillingProduct>): Promise<BillingProduct> {
    return await BillingProduct.query().insert(billingProduct);
  }

  async findByBillingPriceId(priceId: string): Promise<BillingProduct | undefined> {
    return await BillingProduct.query().where('stripe_price_id', priceId).first();
  }

  async findByFeatureKey(key: string): Promise<BillingProduct | undefined> {
    return await BillingProduct.query().where('featureKey', key).first();
  }

  async getActiveProducts(): Promise<BillingProduct[]> {
    return await BillingProduct.query().where('active', true);
  }

  async findById(id: string): Promise<BillingProduct | undefined> {
    return await BillingProduct.query().where('id', id).first();
  }

  async findBySubscriptionType(): Promise<BillingProduct[]> {
    return await BillingProduct.query();
  }

  async findFilteredProducts(filters?: {
    type?: string;
    active?: boolean;
    isPremium?: boolean;
  }): Promise<BillingProduct[]> {
    let query = BillingProduct.query();

    // Apply type filter if provided
    if (filters?.type) {
      query = query.where('type', filters.type);
    }

    // Apply active filter if provided, otherwise default to true
    if (filters?.active !== undefined) {
      query = query.where('active', filters.active);
    } else {
      query = query.where('active', true);
    }

    // Apply isPremium filter if provided
    if (filters?.isPremium !== undefined) {
      query = query.where('is_premium', filters.isPremium);
    }

    return await query;
  }

  async findActiveProductByFeatureKey(key: string): Promise<BillingProduct | undefined> {
    return await BillingProduct.query().where('featureKey', key).where('active', true).first();
  }
}
