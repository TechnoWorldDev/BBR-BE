import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingCategoryRepository } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.repository.interface';
import { RemoveResidenceScoreFromCategoryCommand } from '../commands/remove-residence-score-from-category.command';
import { IRankingScoreRepository } from '../../domain/residence-ranking-score.repository.interface';
import { IResidenceRepository } from 'src/modules/residentmanagement/residence/domain/residence.repository.interface';

@Injectable()
export class RemoveResidenceScoreFromCategoryCommandHandler {
  constructor(
    private readonly rankingScoreRepository: IRankingScoreRepository,
    private readonly rankingCateogryRepository: IRankingCategoryRepository,
    private readonly residenceRepository: IResidenceRepository
  ) {}

  async handle(command: RemoveResidenceScoreFromCategoryCommand) {
    const residence = await this.residenceRepository.findById(command.residenceId);

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    const category = await this.rankingCateogryRepository.findById(command.rankingCategoryId);

    if (!category) {
      throw new NotFoundException('Ranking category not found');
    }

    await this.rankingScoreRepository.removeResidenceScoreFromCategory(residence.id, category.id);

    await this.rankingScoreRepository.updateRankingPositionsForCategory(category.id);
  }
}
