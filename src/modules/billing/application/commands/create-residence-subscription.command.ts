export class CreateResidenceSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly residenceId: string,
    public readonly successUrl: string,
    public readonly cancelUrl: string
  ) {}
} 