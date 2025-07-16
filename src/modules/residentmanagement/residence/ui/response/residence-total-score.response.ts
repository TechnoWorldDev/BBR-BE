import { RankingCategoryResponse } from './ranking-category.response';

export class ResidenceTotalScoreResponse {
  constructor(
    public readonly totalScore: number,
    public readonly position: number,
    public readonly rankingCategory: RankingCategoryResponse | null
  ) {}
}
