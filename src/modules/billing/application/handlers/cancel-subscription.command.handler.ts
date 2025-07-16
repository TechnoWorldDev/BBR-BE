import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { StripeService } from 'src/shared/stripe/stripe.service';
import { IUserSubscriptionRepository } from '../../domain/interfaces/user-subscription.repository.interface';
import { CancelSubscriptionCommand } from '../commands/cancel-subscription.command';

@Injectable()
export class CancelSubscriptionCommandHandler {
  constructor(
    private readonly subscriptionRepo: IUserSubscriptionRepository,
    private readonly stripe: StripeService
  ) {}

  @LogMethod()
  async handle(command: CancelSubscriptionCommand): Promise<void> {
    const { userId, subscriptionId } = command;

    const sub = await this.stripe.getSubscription(subscriptionId);
    const subByUser = await this.subscriptionRepo.findByUserId(userId);

    if (!subByUser) {
      throw new NotFoundException('Subscription not found');
    }

    if (subByUser?.subscriptionId !== sub.id) {
      throw new NotFoundException('Subscription not found');
    }

    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    await this.subscriptionRepo.markCanceled(sub.id);

    await this.stripe.cancelSubscription(sub.id);
  }
}
