import { Injectable, NotFoundException } from '@nestjs/common';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { IRankingCriteriaRepository } from 'src/modules/shared/rankingmanagement/criteria/domain/ranking-criteria.repository.interface';
import { IRankingScoreRepository } from '../../domain/residence-ranking-score.repository.interface';
import { ScoreResidenceCommand } from '../commands/score-residence.command';

@Injectable()
export class ScoreResidenceCommandHandler {
  constructor(
    private readonly rankingScoreRepository: IRankingScoreRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCriteriaRepository: IRankingCriteriaRepository
  ) {}

  async handle(command: ScoreResidenceCommand): Promise<void> {
    const { residenceId, scores } = command;

    const isResidenceExists = await this.residenceRepository.findById(residenceId);
    if (!isResidenceExists) throw new NotFoundException('Residence not found');

    const criteriaIds = scores.map((score) => score.rankingCriteriaId);
    const existingCriteria = await this.rankingCriteriaRepository.findByIds(criteriaIds);

    if (existingCriteria.length !== criteriaIds.length) {
      throw new NotFoundException('Some ranking criteria not found');
    }

    await this.rankingScoreRepository.score(residenceId, scores);

    // await this.rankingScoreRepository.updateAllTotalScoresForResidence(residenceId);
  }
}
