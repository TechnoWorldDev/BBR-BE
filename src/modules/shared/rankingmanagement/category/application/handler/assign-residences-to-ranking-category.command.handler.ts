import { Injectable, NotFoundException } from '@nestjs/common';
import { IRankingScoreRepository } from 'src/modules/residentmanagement/ranking_score/domain/residence-ranking-score.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { AssignResidencesToRankingCategoryCommand } from '../command/assign-residences-to-ranking-category.command';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';

@Injectable()
export class AssignResidencesToRankingCategoryCommandHandler {
  constructor(
    private readonly knexService: KnexService,
    private readonly scoreRepository: IRankingScoreRepository,
    private readonly rankingCategoryRepository: IRankingCategoryRepository
  ) {}

  async handle(command: AssignResidencesToRankingCategoryCommand): Promise<void> {
    const { rankingCategoryId, residenceIds } = command;

    const rankingCategoryExist = await this.rankingCategoryRepository.findById(rankingCategoryId);
    if (!rankingCategoryExist) {
      throw new NotFoundException('Ranking category not found');
    }

    await this.knexService.connection.transaction(async (trx) => {
      for (const residenceId of residenceIds) {
        const exists = await trx('residence_ranking_criteria_scores')
          .where({ residence_id: residenceId })
          .first();

        if (exists) {
          // Ovde se racuna total score
          await this.scoreRepository.updateTotalScore(residenceId, rankingCategoryId);
        }
      }

      // Racunanje pozicije unutar kategorije
      await this.scoreRepository.updateRankingPositionsForCategory(rankingCategoryId);
    });
  }
}
