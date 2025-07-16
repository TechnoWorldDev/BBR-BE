export class SendOnFormSubmitCommand {
  constructor(
    public readonly email: string,
    public readonly fullName: string
  ) {}
}
