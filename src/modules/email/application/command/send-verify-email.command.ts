export class SendVerifyEmailCommand {
  constructor(
    public readonly email: string,
    public readonly verificationLink: string
  ) {}
}
