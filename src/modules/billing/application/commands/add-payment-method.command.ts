export class AddPaymentMethodCommand {
  constructor(
    public readonly userId: string,
    public readonly paymentMethodId: string
  ) {}
}
