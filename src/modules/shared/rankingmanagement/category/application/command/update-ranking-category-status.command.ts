import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class UpdateRankingCategoryStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: RankingCategoryStatus
  ) {}
}
