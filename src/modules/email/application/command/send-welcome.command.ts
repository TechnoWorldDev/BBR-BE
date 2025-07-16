export class SendWelcomeEmailCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly verificationLink: string
  ) {}
}
