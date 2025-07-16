import { RankingCategoryType } from './ranking-category-type.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { FetchRankingCategoryTypesQuery } from '../application/command/fetch-ranking-category-type.query';

export abstract class IRankingCategoryTypeRepository {
  abstract create(
    categoryType: Partial<RankingCategoryType>
  ): Promise<RankingCategoryType | undefined>;
  abstract findById(id: string): Promise<RankingCategoryType | undefined>;
  abstract findAll(
    query: FetchRankingCategoryTypesQuery
  ): Promise<{ data: RankingCategoryType[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<RankingCategoryType | undefined>;
  abstract update(
    id: string,
    data: Partial<RankingCategoryType>
  ): Promise<RankingCategoryType | undefined>;
  abstract delete(id: string): Promise<void>;
}
