import { StripeCustomer } from '../stripe-customer.entity';

export abstract class IStripeCustomerRepository {
  abstract findByUserId(userId: string): Promise<StripeCustomer | undefined>;
  abstract create(input: {
    userId: string;
    stripeCustomerId: string;
  }): Promise<StripeCustomer | undefined>;
}
