import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IPaymentMethodRepository } from '../../domain/interfaces/payment-method.repository.interface';
import { BillingPaymentMethod } from '../../domain/billing-payment-method.entity';

@Injectable()
export class FetchAllPaymentMethodsByUserCommandQuery {
  constructor(private readonly paymentRepo: IPaymentMethodRepository) {}

  @LogMethod()
  async handle(userId: string): Promise<BillingPaymentMethod[]> {
    const isUserExists = await this.paymentRepo.findAllByUser(userId);

    if (!isUserExists) {
      throw new NotFoundException('User not found');
    }

    const result = await this.paymentRepo.findAllByUser(userId);

    return result;
  }
}
