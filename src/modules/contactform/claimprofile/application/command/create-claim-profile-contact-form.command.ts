export class CreateClaimProfileContactFormCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phoneCodeId: string,
    public readonly phoneNumber: string,
    public readonly websiteUrl: string,
    public readonly cvId: string,
    public readonly residenceId: string
  ) {}
}
