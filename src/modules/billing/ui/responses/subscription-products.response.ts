import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionProductResponse {
  @ApiProperty({
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Residence Management Subscription'
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Monthly subscription for managing a residence'
  })
  description: string;

  @ApiProperty({
    description: 'Product amount',
    example: 29.99
  })
  amount: number;

  @ApiProperty({
    description: 'Product currency',
    example: 'USD'
  })
  currency: string;

  @ApiProperty({
    description: 'Billing interval',
    example: 'month'
  })
  interval: string;

  @ApiProperty({
    description: 'Stripe price ID',
    example: 'price_1234567890'
  })
  stripePriceId: string;

  @ApiProperty({
    description: 'Subscription type',
    example: 'residence'
  })
  subscriptionType: string;

  constructor(
    id: string,
    name: string,
    description: string,
    amount: number,
    currency: string,
    interval: string,
    stripePriceId: string,
    subscriptionType: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.amount = amount;
    this.currency = currency;
    this.interval = interval;
    this.stripePriceId = stripePriceId;
    this.subscriptionType = subscriptionType;
  }
} 