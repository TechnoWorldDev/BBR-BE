import { RankingCategory } from '../../domain/ranking-category.entity';
import { RankingCategoryResponse } from '../response/ranking-category.response';

export class RankingCategoryMapper {
  static toResponse(rankingCategory: RankingCategory): RankingCategoryResponse {
    return new RankingCategoryResponse(rankingCategory.id, rankingCategory.name);
  }
}
