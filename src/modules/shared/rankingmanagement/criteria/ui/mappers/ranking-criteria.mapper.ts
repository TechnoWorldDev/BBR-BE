import { RankingCriteria } from '../../domain/ranking-criteria.entity';
import { RankingCriteriaResponse } from '../response/ranking-criteria.response';

export class RankingCriteriaMapper {
  static toResponse(rankingCriteria: RankingCriteria): RankingCriteriaResponse {
    return new RankingCriteriaResponse(
      rankingCriteria.id,
      rankingCriteria.name,
      rankingCriteria.description,
      rankingCriteria.weight,
      rankingCriteria.isDefault,
      rankingCriteria.updatedAt,
      rankingCriteria.createdAt
    );
  }
}
