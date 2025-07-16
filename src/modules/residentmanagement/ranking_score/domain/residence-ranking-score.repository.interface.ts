export abstract class IRankingScoreRepository {
  abstract score(
    residenceId: string,
    scores: {
      rankingCriteriaId: string;
      score: number;
    }[]
  ): Promise<void>;

  abstract updateTotalScore(residenceId: string, rankingCategoryId: string): Promise<void>;
  abstract updateRankingPositionsForCategory(rankingCategoryId: string): Promise<void>;
  abstract updateAllTotalScoresForResidence(residenceId: string): Promise<void>;
  abstract getCriteriaWithCategoriesForResidence(residenceId: string): Promise<any>;
  abstract removeResidenceScoreFromCategory(
    residenceId: string,
    rankingCategoryId: string
  ): Promise<void>;
}
