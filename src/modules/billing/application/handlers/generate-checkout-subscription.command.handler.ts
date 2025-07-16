import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StripeService } from 'src/shared/stripe/stripe.service';
import Stripe from 'stripe';
import { GenerateCheckoutCommand } from '../commands/generate-checkout.command';
import { StripeCustomerService } from '../services/stripe-customer.service';

@Injectable()
export class GenerateCheckoutSubscriptionCommandHandler {
  constructor(
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService
  ) {}

  async handle(command: GenerateCheckoutCommand): Promise<Stripe.Checkout.Session> {
    const { userId, priceId, email, successUrl, cancelUrl, metadata } = command;
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, email);

    if (!customerId) throw new NotFoundException('Customer not found');

    const session = await this.stripe.createCheckoutSession({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        userId,
        ...metadata,
      },
      line_items: [{ price: priceId, quantity: 1 }],
    });

    if (!session) throw new InternalServerErrorException('Checkout session not created');

    return session;
  }
}
