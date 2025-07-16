import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { RankingCategory } from '../../domain/ranking-category.entity';

@Injectable()
export class FindRankingCategoryByIdCommandQuery {
  constructor(private readonly rankingCategoryRepository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(id: string): Promise<RankingCategory> {
    const rankingCategory = await this.rankingCategoryRepository.findById(id);
    if (!rankingCategory) {
      throw new NotFoundException('Ranking category not found');
    }
    return rankingCategory;
  }
}
