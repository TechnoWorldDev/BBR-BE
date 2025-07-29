import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateRankingSubscriptionCommand } from '../commands/create-ranking-subscription.command';
import { TwoTierSubscriptionService } from '../services/two-tier-subscription.service';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { StripeCustomerService } from '../services/stripe-customer.service';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';
import Stripe from 'stripe';

@Injectable()
export class CreateRankingSubscriptionCommandHandler {
  constructor(
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly stripe: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly productRepo: IBillingProductRepository
  ) {}

  async handle(command: CreateRankingSubscriptionCommand): Promise<Stripe.Checkout.Session> {
    const { userId, residenceId, rankingCategoryId, successUrl, cancelUrl } = command;

    // Validate that user has active residence subscription
    const validation = await this.twoTierSubscriptionService.validateRankingApplication(userId, residenceId);
    
    if (!validation.canApply) {
      throw new BadRequestException(validation.reason);
    }

    // Get the specific ranking category to validate it exists and get its stripe price
    const rankingCategory = await RankingCategory.query()
      .where('id', rankingCategoryId)
      .where('status', 'ACTIVE')
      .whereNotNull('stripePriceId')
      .first();

    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found, not active, or missing Stripe price ID');
    }

    // Get or create Stripe customer
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(userId, '');

    if (!customerId) {
      throw new BadRequestException('Failed to create or retrieve customer');
    }

    // Create Stripe checkout session using the ranking category's stripe_price_id
    const session = await this.stripe.createCheckoutSession({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        userId,
        residenceId,
        rankingCategoryId,
        rankingCategoryName: rankingCategory.name,
        subscriptionType: 'ranking',
      },
      line_items: [{ price: rankingCategory.stripePriceId, quantity: 1 }],
    });

    if (!session) {
      throw new BadRequestException('Failed to create checkout session');
    }

    return session;
  }
} 