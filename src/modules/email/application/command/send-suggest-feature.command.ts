export class SendSuggestFeatureCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly exploreMoreResidencesLink: string
  ) {}
}
