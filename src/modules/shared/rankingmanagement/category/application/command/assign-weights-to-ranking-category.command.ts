export class AssignWeightsToRankingCategoryCommand {
  constructor(
    public readonly rankingCategoryId: string,
    public readonly criteria: { rankingCriteriaId: string; weight: number }[]
  ) {}
}
