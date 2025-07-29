import { Controller, Get, Query, Param, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FetchFilteredProductsCommandQuery } from '../application/query/fetch-filtered-products.command.query';
import { BillingMapper } from './mappers/billing.mapper';
import { ProductResponse } from './responses/product.response';
import { IBillingProductRepository } from '../domain/interfaces/billing-product.repository.interface';
import { TwoTierSubscriptionService } from '../application/services/two-tier-subscription.service';
import { CreateResidenceSubscriptionRequest } from './requests/create-residence-subscription.request';
import { IUserRepository } from 'src/modules/user/domain/user.repository.interface';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { PasswordEncoder } from 'src/shared/passwordEncoder/password-encoder.util';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { StripeCustomerService } from '../application/services/stripe-customer.service';
import { IUserSubscriptionRepository } from '../domain/interfaces/user-subscription.repository.interface';
import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UserSubscription } from '../domain/user-subscription.entity';

@ApiTags('Billing Public')
@Controller('public/billing')
export class BillingPublicController {
  constructor(
    private readonly fetchFilteredProductsCommandQuery: FetchFilteredProductsCommandQuery,
    private readonly productRepository: IBillingProductRepository,
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly userRepository: IUserRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly passwordEncoder: PasswordEncoder,
    private readonly stripeService: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly userSubscriptionRepository: IUserSubscriptionRepository
  ) {}

  @Get('/public/products')
  @ApiOperation({ summary: 'Get all active billing products' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  //   @ApiQuery({
  //     name: 'type',
  //     required: false,
  //     enum: ['ONE_TIME', 'SUBSCRIPTION'],
  //     description: 'Filter by product type',
  //   })
  @ApiQuery({
    name: 'active',
    required: false,
    type: Boolean,
    description: 'Filter by active status (default: true)',
  })
  @ApiQuery({
    name: 'isPremium',
    required: false,
    type: Boolean,
    description: 'Filter by premium status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of billing products',
    type: [ProductResponse],
  })
  async fetchAllProducts(
    // @Query('type') type?: string,
    @Query('active') active?: boolean,
    @Query('isPremium') isPremium?: boolean
  ): Promise<{ data: ProductResponse[] }> {
    const filters = {
      // type,
      active: active !== undefined ? active : true,
      isPremium,
    };

    const result = await this.fetchFilteredProductsCommandQuery.handle(filters);

    return {
      data: result.map((product) => BillingMapper.toProductResponse(product)),
    };
  }

  @Get('/public/products/:featureKey')
  @ApiOperation({ summary: 'Get billing product by feature key' })
  @ApiResponse({
    status: 200,
    description: 'Billing product details',
    type: ProductResponse,
  })
  async getProductByFeatureKey(
    @Param('featureKey') featureKey: string
  ): Promise<ProductResponse | null> {
    const product = await this.productRepository.findActiveProductByFeatureKey(featureKey);

    if (!product) {
      return null;
    }

    return BillingMapper.toProductResponse(product);
  }

  @Post('/public/residence-subscription')
  @ApiOperation({ summary: 'Create residence subscription (premium plan)' })
  @ApiResponse({
    status: 201,
    description: 'Residence subscription created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error or duplicate subscription',
  })
  async createResidenceSubscription(
    @Body() request: CreateResidenceSubscriptionRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      // 1. Find or create user (similar to apply-for-ranking)
      let user = await this.userRepository.findByEmail(request.email);

      if (!user) {
        // Create new user
        const hashedPassword = await PasswordEncoder.hash(request.password);
        const newUser = await this.userRepository.create({
          email: request.email,
          fullName: request.fullName,
          password: hashedPassword,
          // Add other required user fields as needed
        });

        if (!newUser) {
          res.status(400).json({
            success: false,
            message: 'Failed to create user',
          });
          return;
        }

        user = newUser;
      }

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Failed to create or find user',
        });
        return;
      }

      // 2. Find or create residence
      let residence;

      if (!request.propertyId || request.propertyId.trim() === '') {
        // Create new residence with generated ID
        const newResidenceId = crypto.randomUUID();

        // Generate slug from property name
        const slug = request.propertyName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9\s]/g, '')
          .trim()
          .replace(/\s+/g, '-');

        residence = await this.residenceRepository.create({
          id: newResidenceId,
          name: request.propertyName,
          slug: slug,
          address: request.address,
          countryId: request.countryId,
          cityId: request.cityId,
          status: ResidenceStatusEnum.ACTIVE,
          developmentStatus: DevelopmentStatusEnum.PLANNED,
          subtitle: '',
          description: '',
          budgetStartRange: 0,
          budgetEndRange: 0,
          yearBuilt: new Date().getFullYear().toString(),
          floorSqft: 0,
          staffRatio: 0,
          petFriendly: false,
          disabledFriendly: false,
          latitude: '0',
          longitude: '0',
          developerId: user.id,
        });
      } else {
        residence = await this.residenceRepository.findById(request.propertyId);

        if (!residence) {
          // Create new residence with the provided propertyId
          const slug = request.propertyName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');

          residence = await this.residenceRepository.create({
            id: request.propertyId,
            name: request.propertyName,
            slug: slug,
            address: request.address,
            countryId: request.countryId,
            cityId: request.cityId,
            status: ResidenceStatusEnum.ACTIVE,
            developmentStatus: DevelopmentStatusEnum.PLANNED,
            subtitle: '',
            description: '',
            budgetStartRange: 0,
            budgetEndRange: 0,
            yearBuilt: new Date().getFullYear().toString(),
            floorSqft: 0,
            staffRatio: 0,
            petFriendly: false,
            disabledFriendly: false,
            latitude: '0',
            longitude: '0',
            developerId: user.id,
          });
        }
      }

      if (!residence) {
        res.status(400).json({
          success: false,
          message: 'Failed to create or find residence',
        });
        return;
      }

      // 3. Validate the billing product (plan)
      const product = await this.productRepository.findById(request.planId);

      if (!product || !product.active) {
        res.status(400).json({
          success: false,
          message: 'Plan not found or inactive',
        });
        return;
      }

      // 4. Check for existing subscription and handle properly
      const existingSubscriptions =
        await this.userSubscriptionRepository.findByUserIdAndResidenceId(user.id, residence.id);

      // Find active subscriptions
      const activeSubscriptions = existingSubscriptions.filter(
        (sub) => sub.status === SubscriptionStatusEnum.ACTIVE
      );

      // Early check: If user already has an active residence subscription, prevent purchase
      const existingActiveResidenceSubscription = activeSubscriptions.find(
        (sub) =>
          sub.subscriptionId !== 'FREE_PLAN' &&
          sub.subscriptionId.startsWith('sub_') &&
          (sub.rankingCategoryId === null || sub.rankingCategoryId === undefined)
      );

      if (existingActiveResidenceSubscription) {
        console.log(`User already has an active residence subscription for this residence`);
        res.status(400).json({
          success: false,
          message: 'User already has an active residence subscription for this residence',
          subscriptionId: existingActiveResidenceSubscription.id,
          userId: user.id,
        });
        return;
      }

      let shouldCreateNew = true;
      let existingActiveSubscription: any = null;

      if (activeSubscriptions.length > 0) {
        // Check if any is a free plan or ranking subscription - allow upgrade
        const freeOrRankingSubscription = activeSubscriptions.find(
          (sub) =>
            sub.subscriptionId === 'FREE_PLAN' ||
            (sub.rankingCategoryId !== null && sub.rankingCategoryId !== undefined)
        );

        if (freeOrRankingSubscription) {
          console.log(`Found free/ranking subscription, will upgrade to residence subscription`);
          existingActiveSubscription = freeOrRankingSubscription;
          shouldCreateNew = true; // Create new residence subscription

          // Mark the free/ranking subscription as inactive
          if (freeOrRankingSubscription.subscriptionId === 'FREE_PLAN') {
            console.log(
              `Marking free plan as inactive for user ${user.id} and residence ${residence.id}`
            );
            // Note: We'll handle this in the database update after creating the new subscription
          }
        } else {
          // No free/ranking subscriptions found, but we already checked for residence subscriptions above
          console.log(
            `No free/ranking subscriptions found, will create new residence subscription`
          );
          shouldCreateNew = true; // Create new
        }
      }

      // Clean up any inactive subscriptions for this user and residence
      const inactiveSubscriptions = existingSubscriptions.filter(
        (sub) => sub.status !== SubscriptionStatusEnum.ACTIVE
      );

      if (inactiveSubscriptions.length > 0) {
        console.log(
          `Found ${inactiveSubscriptions.length} inactive subscriptions for user ${user.id} and residence ${residence.id}`
        );
      }

      // 5. Get or create Stripe customer
      const stripeCustomer = await this.stripeCustomerService.getOrCreateCustomer(
        user.id,
        user.email
      );

      // 6. Attach payment method to customer
      try {
        await this.stripeService.attachPaymentMethod(stripeCustomer, request.stripePaymentMethodId);
        // Set as default payment method
        await this.stripeService.setDefaultPaymentMethod(
          stripeCustomer,
          request.stripePaymentMethodId
        );
      } catch (error) {
        // Payment method might already be attached, continue
        console.log('Payment method attachment error (might already be attached):', error.message);
      }

      let stripeSubscriptionId: string;

      if (shouldCreateNew) {
        // Cancel any existing active subscriptions for this user and residence
        for (const oldSubscription of activeSubscriptions) {
          if (
            oldSubscription.subscriptionId !== 'FREE_PLAN' &&
            oldSubscription.subscriptionId.startsWith('sub_')
          ) {
            try {
              await this.stripeService.cancelSubscription(oldSubscription.subscriptionId);
              console.log(`Cancelled old subscription: ${oldSubscription.subscriptionId}`);
            } catch (error) {
              console.log(
                `Failed to cancel old subscription: ${oldSubscription.subscriptionId}`,
                error.message
              );
            }
          }
        }

        // Create new Stripe subscription
        const newSubscription = await this.stripeService.createSubscription({
          customer: stripeCustomer,
          items: [{ price: product.stripePriceId }],
          payment_behavior: 'error_if_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          default_payment_method: request.stripePaymentMethodId,
          metadata: {
            userId: user.id,
            residenceId: residence.id,
            productId: product.id,
            subscriptionType: 'residence',
          },
        });

        stripeSubscriptionId = newSubscription.id;
      } else {
        // Update the existing Stripe subscription
        if (!existingActiveSubscription) {
          throw new Error('Existing active subscription not found for update');
        }

        const updatedSubscription = await this.stripeService.updateSubscription(
          existingActiveSubscription.subscriptionId,
          {
            items: [{ price: product.stripePriceId }],
            payment_behavior: 'error_if_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            default_payment_method: request.stripePaymentMethodId,
          }
        );

        stripeSubscriptionId = updatedSubscription.id;
      }

      // 6. Create the residence subscription in our database
      // Check if we already have a subscription with this Stripe ID
      const existingWithStripeId = await this.userSubscriptionRepository.findByUserIdAndResidenceId(
        user.id,
        residence.id
      );
      const hasExistingWithStripeId = existingWithStripeId.some(
        (sub) => sub.subscriptionId === stripeSubscriptionId
      );

      if (hasExistingWithStripeId) {
        console.log(
          `Subscription with Stripe ID ${stripeSubscriptionId} already exists in database for this user and residence`
        );
        res.status(400).json({
          success: false,
          message: 'Subscription with this Stripe ID already exists in database',
          userId: user.id,
        });
        return;
      }

      // Additional check: Look for any existing subscription with this Stripe ID across all users
      const allSubscriptionsWithStripeId =
        await this.userSubscriptionRepository.findBySubscriptionId(stripeSubscriptionId);

      if (allSubscriptionsWithStripeId.length > 0) {
        console.log(
          `Subscription with Stripe ID ${stripeSubscriptionId} already exists in database for another user`
        );
        console.log(
          'Existing subscriptions:',
          allSubscriptionsWithStripeId.map((s) => ({
            id: s.id,
            userId: s.userId,
            residenceId: s.residenceId,
          }))
        );
        res.status(400).json({
          success: false,
          message: 'Subscription with this Stripe ID already exists in database',
          userId: user.id,
        });
        return;
      }

      console.log(
        `Creating new subscription with Stripe ID: ${stripeSubscriptionId} for user: ${user.id}, residence: ${residence.id}`
      );

      // Use a transaction to prevent race conditions
      let subscription;
      try {
        subscription = await UserSubscription.transaction(async (trx) => {
          // Double-check for duplicates within the transaction
          const duplicateCheck = await UserSubscription.query(trx).where(
            'subscription_id',
            stripeSubscriptionId
          );

          if (duplicateCheck.length > 0) {
            console.log(`Duplicate detected in transaction for Stripe ID: ${stripeSubscriptionId}`);
            throw new Error('Subscription with this Stripe ID already exists');
          }

          // Create the subscription within the transaction
          return await this.twoTierSubscriptionService.createSubscription({
            userId: user.id,
            productId: product.id,
            subscriptionId: stripeSubscriptionId,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: SubscriptionStatusEnum.ACTIVE,
            residenceId: residence.id,
            metadata: {
              stripeSubscriptionId: stripeSubscriptionId,
              stripePriceId: product.stripePriceId,
              subscriptionType: 'residence',
              isPremium: product.isPremium,
              userEmail: user.email,
              residenceName: residence.name,
              stripePaymentMethodId: request.stripePaymentMethodId,
            },
          });
        });
      } catch (error) {
        if (error.message === 'Subscription with this Stripe ID already exists') {
          console.log(`Duplicate subscription detected: ${stripeSubscriptionId}`);
          res.status(400).json({
            success: false,
            message: 'Subscription with this Stripe ID already exists in database',
            userId: user.id,
          });
          return;
        }
        throw error;
      }

      // 7. Mark free plan or ranking subscription as canceled if we upgraded from it
      if (shouldCreateNew && existingActiveSubscription) {
        const isFreePlan = existingActiveSubscription.subscriptionId === 'FREE_PLAN';
        const isRankingSubscription =
          existingActiveSubscription.rankingCategoryId !== null &&
          existingActiveSubscription.rankingCategoryId !== undefined;

        if (isFreePlan || isRankingSubscription) {
          try {
            await this.userSubscriptionRepository.markCanceled(
              existingActiveSubscription.subscriptionId
            );
            console.log(
              `Marked ${isFreePlan ? 'free plan' : 'ranking'} subscription ${existingActiveSubscription.subscriptionId} as canceled`
            );
          } catch (error) {
            console.error(
              `Failed to mark ${isFreePlan ? 'free plan' : 'ranking'} subscription as canceled:`,
              error
            );
          }
        }
      }

      res.status(201).json({
        success: true,
        message: shouldCreateNew
          ? 'Residence subscription created successfully'
          : 'Residence subscription upgraded successfully',
        subscriptionId: subscription.id,
        userId: user.id,
      });
    } catch (error) {
      console.error('Error creating residence subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create residence subscription',
      });
    }
  }
}
