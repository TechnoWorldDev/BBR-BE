export class ProductResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly featureKey: string,
    public readonly type: string,
    public readonly stripeProductId: string,
    public readonly stripePriceId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly active: boolean,
    public readonly interval: string
  ) {}
}
