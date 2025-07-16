import { ResidenceTotalScore } from '../../domain/residence-total-score.entity';
import { ResidenceTotalScoreResponse } from '../response/residence-total-score.response';
import { RankingCategoryMapper } from './ranking-category.mapper';

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
