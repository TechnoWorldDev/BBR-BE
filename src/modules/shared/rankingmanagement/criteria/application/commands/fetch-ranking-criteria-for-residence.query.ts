export class FetchAllRankingCriteriaForResidenceQuery {
  constructor(
    public readonly residenceId: string,
    public readonly rankingCategoryId: string
  ) {}
}
