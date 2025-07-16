export class SendContactUsEmailCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly exploreMoreResidencesLink: string
  ) {}
}
