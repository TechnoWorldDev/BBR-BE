import Stripe from 'stripe';

export enum SubscriptionStatusEnum {
  ACTIVE = 'ACTIVE',
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
  PAUSED = 'PAUSED',
  TRIALING = 'TRIALING',
  UNPAID = 'UNPAID',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
}

export const mapStripeSubscriptionStatusToEnum = (
  status: Stripe.Subscription.Status
): SubscriptionStatusEnum => {
  switch (status) {
    case 'active':
      return SubscriptionStatusEnum.ACTIVE;
    case 'past_due':
      return SubscriptionStatusEnum.PAST_DUE;
    case 'canceled':
      return SubscriptionStatusEnum.CANCELED;
    case 'incomplete':
      return SubscriptionStatusEnum.INCOMPLETE;
    case 'incomplete_expired':
      return SubscriptionStatusEnum.INCOMPLETE_EXPIRED;
    case 'trialing':
      return SubscriptionStatusEnum.TRIALING;
    case 'unpaid':
      return SubscriptionStatusEnum.UNPAID;
    case 'paused':
      return SubscriptionStatusEnum.PAUSED;
    default:
      throw new Error(`Unknown subscription status from Stripe: ${status}`);
  }
};
