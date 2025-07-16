import { ResidenceTotalScoreResponse } from 'src/modules/residentmanagement/residence/ui/response/residence-total-score.response';
import { ResidenceTotalScore } from '../../domain/residence-total-score.entity';
import { RankingCategoryMapper } from 'src/modules/shared/rankingmanagement/category/ui/mapper/ranking-category.mapper';

export class ResidenceTotalScoreMapper {
  static toResponse(rankingScore: ResidenceTotalScore): ResidenceTotalScoreResponse {
    return new ResidenceTotalScoreResponse(
      rankingScore.totalScore,
      rankingScore.position,
      rankingScore.rankingCategory
        ? RankingCategoryMapper.toResponse(rankingScore.rankingCategory)
        : null
    );
  }
}
