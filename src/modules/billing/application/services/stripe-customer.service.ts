import { Injectable } from '@nestjs/common';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { IStripeCustomerRepository } from '../../domain/interfaces/stripe-customer.repository.interface';

@Injectable()
export class StripeCustomerService {
  constructor(
    private readonly stripe: StripeService,
    private readonly customerRepo: IStripeCustomerRepository
  ) {}

  async getOrCreateCustomer(userId: string, email: string): Promise<string> {
    const existing = await this.customerRepo.findByUserId(userId);
    if (existing) return existing.stripeCustomerId;

    const existingCustomer = await this.stripe.listCustomerByEmail(email);
    if (existingCustomer.data.length > 0) {
      {
        const stripeId = existingCustomer.data[0].id;
        await this.customerRepo.create({ userId, stripeCustomerId: stripeId });

        return stripeId;
      }
    }

    const customer = await this.stripe.createCustomer({ email, metadata: { userId } });

    await this.customerRepo.create({ userId, stripeCustomerId: customer.id });

    return customer.id;
  }
}
