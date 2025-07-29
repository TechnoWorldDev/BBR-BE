export class SendPaymentConfirmationCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly residenceName: string,
    public readonly scheduleCallLink: string
  ) {}
} 