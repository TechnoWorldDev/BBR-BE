export class ValidateUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
