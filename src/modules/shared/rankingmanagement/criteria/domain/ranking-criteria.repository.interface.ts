import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { RankingCriteria } from './ranking-criteria.entity';
import { FetchRankingCriteriaQuery } from '../application/commands/fetch-ranking-criteria.query';

export abstract class IRankingCriteriaRepository {
  abstract create(data: Partial<RankingCriteria>): Promise<RankingCriteria | undefined>;
  abstract update(id: string, data: Partial<RankingCriteria>): Promise<RankingCriteria | undefined>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<RankingCriteria | undefined>;
  abstract findByIds(ids: string[]): Promise<RankingCriteria[]>;
  abstract findByName(name: string): Promise<RankingCriteria | undefined>;
  abstract findAll(
    query: FetchRankingCriteriaQuery
  ): Promise<{ data: RankingCriteria[]; pagination: PaginationResponse }>;
  abstract findAllByResidenceAndCategory(
    residenceId: string,
    rankingCategoryId: string
  ): Promise<RankingCriteria[]>;
}
