import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { IRankingCriteriaRepository } from 'src/modules/shared/rankingmanagement/criteria/domain/ranking-criteria.repository.interface';
import { IRankingScoreRepository } from '../../domain/residence-ranking-score.repository.interface';
import { ScoreMultipleResidencesCommand } from '../commands/score-residence-multiple.command';

@Injectable()
export class ScoreMultipleResidencesCommandHandler {
  constructor(
    private readonly rankingScoreRepository: IRankingScoreRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCriteriaRepository: IRankingCriteriaRepository
  ) {}

  async handle(command: ScoreMultipleResidencesCommand): Promise<void> {
    for (const item of command.items) {
      const { residenceId, scores } = item;

      const isResidenceExists = await this.residenceRepository.findById(residenceId);
      if (!isResidenceExists) {
        throw new NotFoundException(`Residence not found: ${residenceId}`);
      }

      const criteriaIds = scores.map((score) => score.rankingCriteriaId);
      const existingCriteria = await this.rankingCriteriaRepository.findByIds(criteriaIds);

      if (existingCriteria.length !== criteriaIds.length) {
        throw new NotFoundException(`Some ranking criteria not found for residence ${residenceId}`);
      }

      await this.rankingScoreRepository.score(residenceId, scores);

      // (optional) ako koristiš total score update ovde:
      // await this.rankingScoreRepository.updateAllTotalScoresForResidence(residenceId);
    }
  }
}
