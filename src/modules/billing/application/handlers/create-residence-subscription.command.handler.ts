import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateResidenceSubscriptionCommand } from '../commands/create-residence-subscription.command';
import { TwoTierSubscriptionService } from '../services/two-tier-subscription.service';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { StripeCustomerService } from '../services/stripe-customer.service';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import Stripe from 'stripe';

@Injectable()
export class CreateResidenceSubscriptionCommandHandler {
  constructor(
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly productRepo: IBillingProductRepository
  ) {}

  async handle(command: CreateResidenceSubscriptionCommand): Promise<Stripe.Checkout.Session> {
    const { userId, residenceId, successUrl, cancelUrl } = command;

    // Get residence subscription products
    const products = await this.twoTierSubscriptionService.getSubscriptionProducts();
    
    if (products.length === 0) {
      throw new NotFoundException('No residence subscription products found');
    }

    // Use the first available residence product
    const product = products[0];

    // Get or create Stripe customer
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, '');

    if (!customerId) {
      throw new BadRequestException('Failed to create or retrieve customer');
    }

    // Create Stripe checkout session
    const session = await this.stripe.createCheckoutSession({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        userId,
        residenceId,
        subscriptionType: 'residence',
        productId: product.id,
      },
      line_items: [{ price: product.stripePriceId, quantity: 1 }],
    });

    if (!session) {
      throw new BadRequestException('Failed to create checkout session');
    }

    return session;
  }
} 