export class SendJobApplicationCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly exploreMoreOpportunitiesLink: string
  ) {}
}
