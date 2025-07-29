import { UserSubscription } from '../user-subscription.entity';
import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';

export abstract class IUserSubscriptionRepository {
  abstract upsert(subscription: Partial<UserSubscription>): Promise<UserSubscription | undefined>;
  abstract markCanceled(subscriptionId: string): Promise<void>;
  abstract markFailed(subscriptionId: string): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserSubscription | undefined>;
  
  // New methods for two-tier subscription system
  abstract findByUserIdAndResidenceId(userId: string, residenceId: string): Promise<UserSubscription[]>;
  abstract findByUserIdAndResidenceIdAndRankingCategoryId(
    userId: string, 
    residenceId: string, 
    rankingCategoryId: string
  ): Promise<UserSubscription | undefined>;
  abstract findActiveResidenceSubscriptions(userId: string, residenceId: string): Promise<UserSubscription[]>;
  abstract findActiveRankingSubscriptions(userId: string, residenceId: string): Promise<UserSubscription[]>;
  abstract findByResidenceIdAndStatus(residenceId: string, status: SubscriptionStatusEnum): Promise<UserSubscription[]>;
  abstract findByRankingCategoryIdAndStatus(rankingCategoryId: string, status: SubscriptionStatusEnum): Promise<UserSubscription[]>;
  abstract findBySubscriptionId(subscriptionId: string): Promise<UserSubscription[]>;
}
