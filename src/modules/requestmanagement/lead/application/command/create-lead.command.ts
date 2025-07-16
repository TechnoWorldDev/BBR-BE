export class CreateLeadCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly preferredContactMethod:  string[] | null,
  ) {}
}
