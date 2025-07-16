import { UserSubscription } from '../user-subscription.entity';

export abstract class IUserSubscriptionRepository {
  abstract upsert(subscription: Partial<UserSubscription>): Promise<UserSubscription | undefined>;
  abstract markCanceled(subscriptionId: string): Promise<void>;
  abstract markFailed(subscriptionId: string): Promise<void>;
  abstract findByUserId(userId: string): Promise<UserSubscription | undefined>;
}
