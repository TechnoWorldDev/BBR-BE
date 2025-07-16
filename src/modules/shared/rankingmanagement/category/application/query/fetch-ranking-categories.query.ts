import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { FetchRankingCategoriesQuery } from '../command/fetch-ranking.categories.query';

@Injectable()
export class FetchRankingCategoriesCommandQuery {
  constructor(private readonly rankingCategoryRepository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: RankingCategory[]; pagination: PaginationResponse }> {
    const result = await this.rankingCategoryRepository.findAll(query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
