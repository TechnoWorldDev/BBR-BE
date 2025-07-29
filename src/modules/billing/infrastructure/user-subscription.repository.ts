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
    residenceId?: string;
    rankingCategoryId?: string;
    metadata?: any;
  }): Promise<UserSubscription | undefined> {
    return await UserSubscription.query()
      .insert({
        userId: input.userId,
        productId: input.productId,
        subscriptionId: input.subscriptionId,
        currentPeriodEnd: input.currentPeriodEnd,
        status: input.status,
        residenceId: input.residenceId,
        rankingCategoryId: input.rankingCategoryId,
        metadata: input.metadata,
      })
      .onConflict(['user_id', 'residence_id', 'ranking_category_id', 'subscription_id'])
      .merge();
  }

  async markCanceled(subscriptionId: string): Promise<void> {
    await UserSubscription.query()
      .where('subscription_id', subscriptionId)
      .update({ status: SubscriptionStatusEnum.CANCELED, updatedAt: new Date() });
  }

  async markFailed(subscriptionId: string): Promise<void> {
    await UserSubscription.query()
      .where('subscription_id', subscriptionId)
      .update({ status: SubscriptionStatusEnum.PAST_DUE, updatedAt: new Date() });
  }

  async findByUserId(userId: string): Promise<UserSubscription | undefined> {
    return await UserSubscription.query().where('user_id', userId).first();
  }

  // New methods for two-tier subscription system
  async findByUserIdAndResidenceId(userId: string, residenceId: string): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('user_id', userId)
      .where('residence_id', residenceId);
  }

  async findByUserIdAndResidenceIdAndRankingCategoryId(
    userId: string, 
    residenceId: string, 
    rankingCategoryId: string
  ): Promise<UserSubscription | undefined> {
    return await UserSubscription.query()
      .where('user_id', userId)
      .where('residence_id', residenceId)
      .where('ranking_category_id', rankingCategoryId)
      .first();
  }

  async findActiveResidenceSubscriptions(userId: string, residenceId: string): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('user_id', userId)
      .where('residence_id', residenceId)
      .where('status', SubscriptionStatusEnum.ACTIVE)
      .whereNull('ranking_category_id');
  }

  async findActiveRankingSubscriptions(userId: string, residenceId: string): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('user_id', userId)
      .where('residence_id', residenceId)
      .where('status', SubscriptionStatusEnum.ACTIVE)
      .whereNotNull('ranking_category_id');
  }

  async findByResidenceIdAndStatus(residenceId: string, status: SubscriptionStatusEnum): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('residence_id', residenceId)
      .where('status', status);
  }

  async findByRankingCategoryIdAndStatus(rankingCategoryId: string, status: SubscriptionStatusEnum): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('ranking_category_id', rankingCategoryId)
      .where('status', status);
  }

  async findBySubscriptionId(subscriptionId: string): Promise<UserSubscription[]> {
    return await UserSubscription.query()
      .where('subscription_id', subscriptionId);
  }
}
