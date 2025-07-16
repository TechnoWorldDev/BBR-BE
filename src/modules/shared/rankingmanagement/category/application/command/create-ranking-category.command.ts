import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class CreateRankingCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly rankingCategoryTypeId: string,
    public readonly residenceLimitation: number,
    public readonly rankingPrice: number,
    public readonly featuredImageId: string,
    public readonly status: RankingCategoryStatus,
    public readonly entityId?: string
  ) {}
}
