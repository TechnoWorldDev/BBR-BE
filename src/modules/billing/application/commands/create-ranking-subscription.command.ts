export class CreateRankingSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly residenceId: string,
    public readonly rankingCategoryId: string,
    public readonly successUrl: string,
    public readonly cancelUrl: string
  ) {}
} 