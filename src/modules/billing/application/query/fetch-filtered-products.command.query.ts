import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';

export interface ProductFilters {
  type?: string;
  active?: boolean;
  isPremium?: boolean;
}

@Injectable()
export class FetchFilteredProductsCommandQuery {
  constructor(private readonly productRepository: IBillingProductRepository) {}

  @LogMethod()
  async handle(filters?: ProductFilters) {
    const result = await this.productRepository.findFilteredProducts(filters);
    return result;
  }
}