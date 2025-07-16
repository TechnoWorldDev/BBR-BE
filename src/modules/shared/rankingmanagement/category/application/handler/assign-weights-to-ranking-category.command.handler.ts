import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignWeightsToRankingCategoryCommand } from '../command/assign-weights-to-ranking-category.command';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { IRankingCriteriaRepository } from '../../../criteria/domain/ranking-criteria.repository.interface';

@Injectable()
export class AssignWeightsToRankingCategoryCommandHandler {
  constructor(
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly rankingCriteriaRepository: IRankingCriteriaRepository
  ) {}

  async handle(command: AssignWeightsToRankingCategoryCommand): Promise<void> {
    const { rankingCategoryId, criteria } = command;

    const rankingCategory = await this.rankingCategoryRepository.findById(rankingCategoryId);
    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }

    const criteriaIds = criteria.map((criteria) => criteria.rankingCriteriaId);

    const existingCriteria = await this.rankingCriteriaRepository.findByIds(criteriaIds);

    if (existingCriteria.length !== criteriaIds.length) {
      throw new NotFoundException('Some ranking criteria not found');
    }

    await this.rankingCategoryRepository.assignWeights(rankingCategoryId, criteria);
  }
}
