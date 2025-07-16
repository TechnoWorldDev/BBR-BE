import { Injectable } from '@nestjs/common';
import { IResidenceRepository } from 'src/modules/favorite/domain/residence.repository.interface';
import { IRankingScoreRepository } from '../../domain/residence-ranking-score.repository.interface';

@Injectable()
export class FetchScoresResidenceCommandQuery {
  constructor(private readonly rankingScoreRepository: IRankingScoreRepository) {}

  async handle(residenceId: string) {
    return await this.rankingScoreRepository.getCriteriaWithCategoriesForResidence(residenceId);
  }
}
