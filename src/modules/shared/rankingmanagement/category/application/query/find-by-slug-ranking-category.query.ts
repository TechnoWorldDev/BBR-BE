import { Injectable, NotFoundException } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { RankingCategory } from '../../domain/ranking-category.entity';

@Injectable()
export class FindRankingCategoryBySlugCommandQuery {
  constructor(private readonly rankingCategoryRespository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(slug: string): Promise<RankingCategory> {
    const rankingCategory = await this.rankingCategoryRespository.findBySlug(slug);
    if (!rankingCategory) {
      throw new NotFoundException('Ranking Category not found');
    }
    return rankingCategory;
  }
}
