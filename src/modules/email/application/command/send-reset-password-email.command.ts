export class SendResetPasswordEmailCommand {
  constructor(
    public readonly email: string,
    public readonly otp: string
  ) {}
}
