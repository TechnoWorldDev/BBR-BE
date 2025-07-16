export class SendSubmitReviewCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly residenceName: string,
    public readonly exploreMoreResidencesLink: string
  ) {}
}
