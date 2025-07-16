import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { RankingCategoryType } from '../../domain/ranking-category-type.entity';
import { IRankingCategoryTypeRepository } from '../../domain/ranking-category-type.repository.interface';
import { FetchRankingCategoryTypesQuery } from '../command/fetch-ranking-category-type.query';

@Injectable()
export class FetchRankingCategoryTypesCommandQuery {
  constructor(private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository) {}

  @LogMethod()
  async handler(
    query: FetchRankingCategoryTypesQuery
  ): Promise<{ data: RankingCategoryType[]; pagination: PaginationResponse }> {
    const result = await this.rankingCategoryTypeRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
