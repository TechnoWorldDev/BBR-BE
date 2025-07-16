import { Injectable } from '@nestjs/common';
import { UserSubscription } from '../domain/user-subscription.entity';
import { SubscriptionStatusEnum } from 'src/shared/types/subscription-status.enum';
import { IUserSubscriptionRepository } from '../domain/interfaces/user-subscription.repository.interface';

@Injectable()
export class UserSubscriptionRepositoryImpl implements IUserSubscriptionRepository {
  async upsert(input: {
    userId: string;
    productId: string;
    subscriptionId: string;
    currentPeriodEnd: Date;
    status: SubscriptionStatusEnum;
  }): Promise<UserSubscription | undefined> {
    return await UserSubscription.query()
      .insert({
        userId: input.userId,
        productId: input.productId,
        subscriptionId: input.subscriptionId,
        currentPeriodEnd: input.currentPeriodEnd,
        status: input.status,
      })
      .onConflict(['user_id', 'product_id'])
      .merge();
  }

  async markCanceled(subscriptionId: string): Promise<void> {
    await UserSubscription.query()
      .where('stripe_subscription_id', subscriptionId)
      .update({ status: SubscriptionStatusEnum.CANCELED, updatedAt: new Date() });
  }

  async markFailed(subscriptionId: string): Promise<void> {
    await UserSubscription.query()
      .where('stripe_subscription_id', subscriptionId)
      .update({ status: SubscriptionStatusEnum.PAST_DUE, updatedAt: new Date() });
  }

  async findByUserId(userId: string): Promise<UserSubscription | undefined> {
    return await UserSubscription.query().where('user_id', userId).first();
  }
}
