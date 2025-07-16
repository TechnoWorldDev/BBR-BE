import { Injectable } from '@nestjs/common';
import { StripeCustomer } from '../domain/stripe-customer.entity';
import { IStripeCustomerRepository } from '../domain/interfaces/stripe-customer.repository.interface';

@Injectable()
export class StripeCustomerRepositoryImpl implements IStripeCustomerRepository {
  async findByUserId(userId: string): Promise<StripeCustomer | undefined> {
    return await StripeCustomer.query().where('user_id', userId).first();
  }

  async create(input: {
    userId: string;
    stripeCustomerId: string;
  }): Promise<StripeCustomer | undefined> {
    return await StripeCustomer.query().insert({
      userId: input.userId,
      stripeCustomerId: input.stripeCustomerId,
    });
  }
}
