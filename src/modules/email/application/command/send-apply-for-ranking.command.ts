export class SendApplyForRankingCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly residenceName: string,
    public readonly categoryName: string,
    public readonly exploreMoreResidencesLink: string
  ) {}
}
