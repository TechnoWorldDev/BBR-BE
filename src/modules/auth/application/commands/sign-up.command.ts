export class SignUpCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
