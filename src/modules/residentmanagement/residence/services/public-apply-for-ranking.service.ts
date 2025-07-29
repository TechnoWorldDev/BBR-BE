import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PublicApplyForRankingRequest } from '../ui/request/public-apply-for-ranking.request';
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';
import { IResidenceRepository } from '../domain/residence.repository.interface';
import { TwoTierSubscriptionService } from 'src/modules/billing/application/services/two-tier-subscription.service';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';
import { IResidencePositionRequestsRepository } from '../../residence_position_requests/domain/residence-position-requests.repository.interface';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';
import { ResidenceStatusEnum } from '../domain/residence-status.enum';
import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { Residence } from '../domain/residence.entity';
import { SendPaymentConfirmationCommandHandler } from 'src/modules/email/application/send-payment-confirmation.command.handler';
import { IBillingProductRepository } from 'src/modules/billing/domain/interfaces/billing-product.repository.interface';

@Injectable()
export class PublicApplyForRankingService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly residenceRepo: IResidenceRepository,
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly stripe: StripeService,
    private readonly rankingCategoryRepo: IRankingCategoryRepository,
    private readonly positionRequestRepo: IResidencePositionRequestsRepository,
    private readonly sendPaymentConfirmationHandler: SendPaymentConfirmationCommandHandler,
    private readonly productRepo: IBillingProductRepository
  ) {}

  async handle(body: PublicApplyForRankingRequest): Promise<any> {
    if (!body.agree) {
      throw new BadRequestException('You must agree to the terms to apply.');
    }

    const user = await this.getOrCreateUser(body);
    const residence = await this.getOrCreateResidence(body, user.id);

    // Validate that free product exists before proceeding
    const freeProducts = await this.twoTierSubscriptionService.getSubscriptionProducts();
    const freeProduct = freeProducts.find((p) => Number(p.amount) === 0);

    if (!freeProduct) {
      throw new InternalServerErrorException(
        'Free residence plan is not configured. Please contact support.'
      );
    }

    // Check if free plan is already assigned
    const existingSubs = await this.twoTierSubscriptionService.getResidenceSubscriptions(
      user.id,
      residence.id
    );
    // Check if there's already a free plan assigned
    const hasFreePlan = existingSubs.residenceSubscriptions.some(
      (sub) => sub.status === SubscriptionStatusEnum.ACTIVE
    );

    // Assign only if not already assigned
    if (!hasFreePlan) {
      try {
        await this.assignFreePlanToResidence(user.id, residence.id);

        // Verify that the free plan was actually created
        const verificationSubs = await this.twoTierSubscriptionService.getResidenceSubscriptions(
          user.id,
          residence.id
        );
        console.log('verificationSubs', verificationSubs);
        console.log('Checking subscriptions with status:', SubscriptionStatusEnum.ACTIVE);
        const hasFreePlanAfterCreation = verificationSubs.residenceSubscriptions.some(
          (sub) => sub.status === SubscriptionStatusEnum.ACTIVE
        );
        console.log('hasFreePlanAfterCreation', hasFreePlanAfterCreation);

        if (!hasFreePlanAfterCreation) {
          throw new InternalServerErrorException(
            'Free plan was not properly created. Please try again.'
          );
        }

        // Add a small delay to ensure the database transaction is fully committed
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        // Log the specific error for debugging
        console.error('Free plan assignment failed:', error);
        throw new InternalServerErrorException(
          'Failed to assign free plan to residence. Please try again.'
        );
      }
    }

    const customerId = await this.getOrCreateStripeCustomer(user);

    await this.stripe.attachPaymentMethod(customerId, body.stripePaymentMethodId);
    await this.stripe.setDefaultPaymentMethod(customerId, body.stripePaymentMethodId);

    try {
      const rankingSubscriptions = await this.processRankingCategories(
        body.selectedCategoryIds,
        user,
        residence,
        customerId
      );

      // Send payment confirmation email
      try {
        await this.sendPaymentConfirmationHandler.handle({
          to: user.email,
          fullName: user.fullName,
          residenceName: residence.name,
          scheduleCallLink: 'https://calendly.com/bbr/concierge-call', // You can make this configurable
        });
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
        // Don't fail the entire process if email fails
      }

      return {
        success: true,
        userId: user.id,
        residenceId: residence.id,
        rankingSubscriptions,
      };
    } catch (error) {
      console.error('Error in ranking application process:', error);
      // If ranking processing fails, we should still have the free plan and user created
      throw error; // Re-throw the specific error
    }
  }

  // --------------------- Helpers ---------------------

  private async getOrCreateUser(body: PublicApplyForRankingRequest) {
    let user = await this.userRepo.findByEmail(body.email);
    if (user) return user;

    user = (await this.userRepo.create({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      status: UserStatusEnum.ACTIVE,
    })) as any;

    if (!user) throw new InternalServerErrorException('User could not be created');
    return user;
  }

  private async getOrCreateResidence(body: PublicApplyForRankingRequest, userId: string) {
    if (body.propertyId) {
      const residence = await this.residenceRepo.findById(body.propertyId);
      if (!residence) throw new BadRequestException('Property not found');
      return residence;
    }

    const residence = await this.residenceRepo.create({
      name: body.propertyName,
      countryId: body.countryId,
      cityId: body.cityId,
      address: body.address,
      status: ResidenceStatusEnum.ACTIVE,
      slug: Residence.slugify(body.propertyName),
      developerId: userId,
    });

    if (!residence) throw new InternalServerErrorException('Residence could not be created');
    return residence;
  }

  private async assignFreePlanToResidence(userId: string, residenceId: string): Promise<void> {
    try {
      const freeProduct = await this.productRepo.findByFeatureKey('free-residence-plan');

      if (!freeProduct) {
        throw new InternalServerErrorException('No free residence plan found in the system');
      }

      console.log('Creating free plan subscription with:', {
        userId,
        productId: freeProduct.id,
        residenceId,
      });

      // Get or create Stripe customer
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }

      const customerId = await this.getOrCreateStripeCustomer(user);

      // Create Stripe subscription for free plan
      const stripeSubscription = await this.stripe['stripe'].subscriptions.create({
        customer: customerId,
        items: [{ price: freeProduct.stripePriceId }],
        metadata: {
          userId: user.id,
          residenceId: residenceId,
          productId: freeProduct.id,
          subscriptionType: 'residence',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const subscription = await this.twoTierSubscriptionService.createSubscription({
        userId,
        productId: freeProduct.id,
        subscriptionId: stripeSubscription.id, // Use actual Stripe subscription ID
        currentPeriodEnd: new Date(((stripeSubscription as any).current_period_end || 0) * 1000),
        status: SubscriptionStatusEnum.ACTIVE,
        residenceId,
      });
      console.log("subscription", subscription);
      console.log('Free plan subscription created successfully:', subscription);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error; // Re-throw our specific errors
      }
      console.error('Error in assignFreePlanToResidence:', error);
      throw new InternalServerErrorException('Failed to create free plan subscription');
    }
  }

  private async getOrCreateStripeCustomer(user: {
    email: string;
    fullName: string;
    id: string;
  }): Promise<string> {
    const existing = await this.stripe.listCustomerByEmail(user.email);
    if (existing.data?.length > 0) return existing.data[0].id;

    const newCustomer = await this.stripe.createCustomer({
      email: user.email,
      name: user.fullName,
      metadata: { userId: user.id },
    });

    return newCustomer.id;
  }

  private async processRankingCategories(
    selectedCategoryIds: string[],
    user: { id: string },
    residence: { id: string },
    customerId: string
  ): Promise<{ rankingCategoryId: string; subscriptionId: string }[]> {
    try {
      const rankingCategories = await this.rankingCategoryRepo.findByIds(selectedCategoryIds);

      if (rankingCategories.length !== selectedCategoryIds.length) {
        throw new BadRequestException('One or more ranking categories not found');
      }

      const results: { rankingCategoryId: string; subscriptionId: string }[] = [];

      for (const category of rankingCategories) {
        if (!category.stripePriceId) {
          throw new BadRequestException(
            `Ranking category ${category.name} does not have a Stripe price configured`
          );
        }

        try {
          const subscription: any = await this.stripe['stripe'].subscriptions.create({
            customer: customerId,
            items: [{ price: category.stripePriceId }],
            metadata: {
              userId: user.id,
              residenceId: residence.id,
              rankingCategoryId: category.id,
              subscriptionType: 'ranking',
            },
            expand: ['latest_invoice.payment_intent'],
          });

          try {
            // For ranking categories, we use the category itself as the product
            // Since we're not using SubscriptionType table, we'll use a simple string identifier
            await this.twoTierSubscriptionService.createSubscription({
              userId: user.id,
              productId: category.id, // Use the ranking category ID as product ID
              subscriptionId: subscription.id,
              currentPeriodEnd: new Date((subscription.current_period_end || 0) * 1000),
              status: SubscriptionStatusEnum.ACTIVE,
              residenceId: residence.id,
              rankingCategoryId: category.id,
              metadata: { stripeSubscriptionId: subscription.id },
            });

            await this.positionRequestRepo.create({
              residenceId: residence.id,
              rankingCategoryId: category.id,
              requestedBy: user.id,
            });

            results.push({ rankingCategoryId: category.id, subscriptionId: subscription.id });
          } catch (dbError) {
            // If database operations fail, cancel the Stripe subscription
            console.error(
              `Database operation failed for ${category.name}, canceling Stripe subscription:`,
              dbError
            );
            try {
              await this.stripe['stripe'].subscriptions.cancel(subscription.id);
              console.log(
                `Stripe subscription ${subscription.id} canceled due to database failure`
              );
            } catch (cancelError) {
              console.error(
                `Failed to cancel Stripe subscription ${subscription.id}:`,
                cancelError
              );
            }
            throw new InternalServerErrorException(
              `Payment processed but failed to record subscription for ${category.name}. Please contact support.`
            );
          }
        } catch (stripeError) {
          console.error(`Failed to process ranking category ${category.name}:`, stripeError);
          throw new InternalServerErrorException(
            `Failed to process payment for ${category.name}. Please try again.`
          );
        }
      }

      return results;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      console.error('Error in processRankingCategories:', error);
      throw new InternalServerErrorException('Failed to process ranking categories');
    }
  }
}
