export class GenerateCheckoutCommand {
  constructor(
    public readonly userId: string,
    public readonly priceId: string,
    public readonly email: string,
    public readonly successUrl: string,
    public readonly cancelUrl: string,
    public readonly metadata: Record<string, string>
  ) {}
}
