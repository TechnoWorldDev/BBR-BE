import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { FetchRankingCategoriesQuery } from '../command/fetch-ranking.categories.query';
import { User } from 'src/modules/user/domain/user.entity';

@Injectable()
export class FetchRankingCategoriesByUserCommandQuery {
  constructor(private readonly rankingCategoryRepository: IRankingCategoryRepository) {}

  @LogMethod()
  async handle(
    user: User,
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: RankingCategory[]; pagination: PaginationResponse }> {
    const result = await this.rankingCategoryRepository.findAllByUser(user, query);
    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
