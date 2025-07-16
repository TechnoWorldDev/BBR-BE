import { Injectable, NotFoundException } from '@nestjs/common';
import { RankingCriteria } from '../../domain/ranking-criteria.entity';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';
import { FetchAllRankingCriteriaForResidenceQuery } from '../commands/fetch-ranking-criteria-for-residence.query';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';
import { IRankingCategoryRepository } from '../../../category/domain/ranking-category.repository.interface';

@Injectable()
export class FindAllRankingCriteriaForResidenceQueryHandler {
  constructor(
    private readonly rankingCriteriaRepository: IRankingCriteriaRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository
  ) {}

  async handle(command: FetchAllRankingCriteriaForResidenceQuery): Promise<RankingCriteria[]> {
    const { residenceId, rankingCategoryId } = command;

    const isResidenceExists = await this.residenceRepository.findById(residenceId);
    if (!isResidenceExists) {
      throw new NotFoundException('Residence not found');
    }

    const isRankingCategoryExists =
      await this.rankingCategoryRepository.findById(rankingCategoryId);
    if (!isRankingCategoryExists) {
      throw new NotFoundException('Ranking category not found');
    }

    const rankingCriteria = await this.rankingCriteriaRepository.findAllByResidenceAndCategory(
      residenceId,
      rankingCategoryId
    );

    return rankingCriteria;
  }
}
