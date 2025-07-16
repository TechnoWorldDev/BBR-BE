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
}
