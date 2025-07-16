export class SignUpDeveloperCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly companyName?: string
  ) {}
}
