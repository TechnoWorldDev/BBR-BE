import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { UpdateRankingCategoryStatusCommand } from '../command/update-ranking-category-status.command';

@Injectable()
export class UpdateRankingCategoryStatusCommandHandler {
  constructor(private readonly rankingCategoryRepository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(command: UpdateRankingCategoryStatusCommand): Promise<void> {
    const existingRankingCategory = await this.rankingCategoryRepository.findById(command.id);
    if (!existingRankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }

    const updated = await this.rankingCategoryRepository.update(command.id, {
      status: command.status as RankingCategoryStatus,
    });

    if (!updated) {
      throw new InternalServerErrorException('Failed to update ranking category status');
    }
  }
}
