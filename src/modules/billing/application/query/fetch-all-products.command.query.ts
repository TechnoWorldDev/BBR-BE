import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';

@Injectable()
export class FetchAllProductsCommandQuery {
  constructor(private readonly productRepository: IBillingProductRepository) {}

  @LogMethod()
  async handle() {
    const result = await this.productRepository.getActiveProducts();

    return result;
  }
}
