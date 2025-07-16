import { RankingCategory } from './ranking-category.entity';

export abstract class IRankingCategoryRepository {
  abstract findById(id: string): Promise<RankingCategory | undefined>;
}
