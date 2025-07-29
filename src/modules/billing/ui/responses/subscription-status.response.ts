import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionStatusResponse {
  @ApiProperty({
    description: 'Whether the residence has an active subscription',
    example: true
  })
  hasResidenceSubscription: boolean;

  @ApiProperty({
    description: 'Whether the residence has any ranking subscriptions',
    example: true
  })
  hasRankingSubscriptions: boolean;

  @ApiProperty({
    description: 'Total number of active ranking subscriptions',
    example: 3
  })
  totalRankingSubscriptions: number;

  constructor(
    hasResidenceSubscription: boolean,
    hasRankingSubscriptions: boolean,
    totalRankingSubscriptions: number
  ) {
    this.hasResidenceSubscription = hasResidenceSubscription;
    this.hasRankingSubscriptions = hasRankingSubscriptions;
    this.totalRankingSubscriptions = totalRankingSubscriptions;
  }
} 