export class VerifyResetOtpCommand {
  constructor(
    public readonly resetToken: string,
    public readonly otp: string
  ) {}
}
