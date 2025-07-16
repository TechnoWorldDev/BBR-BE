import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { BillingPaymentMethod } from '../../domain/billing-payment-method.entity';
import { IPaymentMethodRepository } from '../../domain/interfaces/payment-method.repository.interface';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly stripe: StripeService,
    private readonly paymentRepo: IPaymentMethodRepository
  ) {}

  //   TODO PREBACITI U HANDLE

  //   TODO PREBACITI U HANDLE
  async setDefault(userId: string, customerId: string, paymentMethodId: string): Promise<void> {
    await this.stripe.setDefaultPaymentMethod(customerId, paymentMethodId);
    await this.paymentRepo.setDefault(userId, paymentMethodId);
  }
  //   TODO PREBACITI U HANDLE
  async detach(paymentMethodId: string): Promise<void> {
    await this.stripe.detachPaymentMethod(paymentMethodId);
    await this.paymentRepo.delete(paymentMethodId);
  }
  //   TODO PREBACITI U HANDLE
  async getAllByUser(userId: string): Promise<BillingPaymentMethod[]> {
    return this.paymentRepo.findAllByUser(userId);
  }
}
