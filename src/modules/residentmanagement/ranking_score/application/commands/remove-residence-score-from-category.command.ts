export class RemoveResidenceScoreFromCategoryCommand {
  constructor(
    public readonly residenceId: string,
    public readonly rankingCategoryId: string
  ) {}
}
