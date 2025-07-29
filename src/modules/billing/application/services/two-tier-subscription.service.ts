import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserSubscriptionRepository } from '../../domain/interfaces/user-subscription.repository.interface';
import { IBillingProductRepository } from '../../domain/interfaces/billing-product.repository.interface';
import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { UserSubscription } from '../../domain/user-subscription.entity';
import { BillingProduct } from '../../domain/billing-product.entity';

@Injectable()
export class TwoTierSubscriptionService {
  constructor(
    private readonly subscriptionRepo: IUserSubscriptionRepository,
    private readonly productRepo: IBillingProductRepository
  ) {}

  /**
   * Check if a residence has an active subscription
   */
  async hasActiveResidenceSubscription(userId: string, residenceId: string): Promise<boolean> {
    const subscriptions = await this.subscriptionRepo.findActiveResidenceSubscriptions(userId, residenceId);
    return subscriptions.length > 0;
  }

  /**
   * Check if a residence has an active ranking subscription for a specific category
   */
  async hasActiveRankingSubscription(
    userId: string, 
    residenceId: string, 
    rankingCategoryId: string
  ): Promise<boolean> {
    const subscription = await this.subscriptionRepo.findByUserIdAndResidenceIdAndRankingCategoryId(
      userId, 
      residenceId, 
      rankingCategoryId
    );
    return subscription?.status === SubscriptionStatusEnum.ACTIVE;
  }

  /**
   * Get all active subscriptions for a residence
   */
  async getResidenceSubscriptions(userId: string, residenceId: string): Promise<{
    residenceSubscriptions: UserSubscription[];
    rankingSubscriptions: UserSubscription[];
  }> {
    const residenceSubscriptions = await this.subscriptionRepo.findActiveResidenceSubscriptions(userId, residenceId);
    const rankingSubscriptions = await this.subscriptionRepo.findActiveRankingSubscriptions(userId, residenceId);

    return {
      residenceSubscriptions,
      rankingSubscriptions,
    };
  }

  /**
   * Validate if a user can apply for ranking (must have active residence subscription)
   */
  async validateRankingApplication(userId: string, residenceId: string): Promise<{
    canApply: boolean;
    reason?: string;
  }> {
    const hasResidenceSubscription = await this.hasActiveResidenceSubscription(userId, residenceId);
    
    if (!hasResidenceSubscription) {
      return {
        canApply: false,
        reason: 'Active residence subscription required to apply for ranking',
      };
    }

    return { canApply: true };
  }

  /**
   * Get subscription products by type
   */
  async getSubscriptionProducts(): Promise<BillingProduct[]> {
    return await this.productRepo.findBySubscriptionType();
  }

  /**
   * Create a new subscription
   */
  async createSubscription(input: {
    userId: string;
    productId: string;
    subscriptionId: string;
    currentPeriodEnd: Date;
    status: SubscriptionStatusEnum;
    residenceId: string;
    rankingCategoryId?: string;
    metadata?: any;
  }): Promise<UserSubscription> { 
    // For ranking subscriptions, we use ranking category IDs as product IDs
    // For residence subscriptions, we use billing product IDs
    if (input.rankingCategoryId) {
      // This is a ranking subscription - validate residence subscription exists
      // Try multiple times with small delays to handle potential timing issues
      let hasResidenceSubscription = false;
      for (let i = 0; i < 3; i++) {
        hasResidenceSubscription = await this.hasActiveResidenceSubscription(input.userId, input.residenceId);
        if (hasResidenceSubscription) break;
        if (i < 2) await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      if (!hasResidenceSubscription) {
        throw new BadRequestException('Active residence subscription required for ranking subscriptions');
      }
    } else {
      // This is a residence subscription - validate the billing product exists
      const product = await this.productRepo.findById(input.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    const subscription = await this.subscriptionRepo.upsert(input);
    if (!subscription) {
      throw new Error('Failed to create subscription');
    }

    return subscription;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.subscriptionRepo.markCanceled(subscriptionId);
  }

  /**
   * Get subscription status for a residence
   */
  async getResidenceSubscriptionStatus(userId: string, residenceId: string): Promise<{
    hasResidenceSubscription: boolean;
    hasRankingSubscriptions: boolean;
    totalRankingSubscriptions: number;
  }> {
    const residenceSubscriptions = await this.subscriptionRepo.findActiveResidenceSubscriptions(userId, residenceId);
    const rankingSubscriptions = await this.subscriptionRepo.findActiveRankingSubscriptions(userId, residenceId);

    return {
      hasResidenceSubscription: residenceSubscriptions.length > 0,
      hasRankingSubscriptions: rankingSubscriptions.length > 0,
      totalRankingSubscriptions: rankingSubscriptions.length,
    };
  }
} 