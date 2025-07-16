export class SendB2BFormCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly residenceName: string,
    public readonly companyName: string,
    public readonly exploreMoreResidencesLink: string
  ) {}
}
