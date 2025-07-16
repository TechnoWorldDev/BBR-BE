export class CancelSubscriptionCommand {
  constructor(
    public readonly userId: string,
    public readonly subscriptionId: string
  ) {}
}
