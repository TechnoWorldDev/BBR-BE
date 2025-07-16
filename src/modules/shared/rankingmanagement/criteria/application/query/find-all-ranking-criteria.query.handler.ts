import { Injectable } from '@nestjs/common';
import { FetchRankingCriteriaQuery } from '../commands/fetch-ranking-criteria.query';
import { RankingCriteria } from '../../domain/ranking-criteria.entity';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { IRankingCriteriaRepository } from '../../domain/ranking-criteria.repository.interface';

@Injectable()
export class FindAllRankingCriteriaQueryHandler {
  constructor(private readonly rankingCriteriaRepository: IRankingCriteriaRepository) {}

  async handle(
    query: FetchRankingCriteriaQuery
  ): Promise<{ data: RankingCriteria[]; pagination: PaginationResponse }> {
    const result = await this.rankingCriteriaRepository.findAll(query);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }
}
