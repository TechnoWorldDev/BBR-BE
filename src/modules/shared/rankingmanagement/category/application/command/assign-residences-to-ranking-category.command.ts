export class AssignResidencesToRankingCategoryCommand {
  constructor(
    public readonly rankingCategoryId: string,
    public readonly residenceIds: string[]
  ) {}
}
