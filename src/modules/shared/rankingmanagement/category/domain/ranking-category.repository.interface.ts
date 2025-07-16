import { User } from 'src/modules/user/domain/user.entity';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { FetchResidencesByCategoryQuery } from '../application/command/fetch-residences-by-category.query';
import { RankingCategory } from './ranking-category.entity';

export abstract class IRankingCategoryRepository {
  abstract create(rankingCategory: Partial<RankingCategory>): Promise<RankingCategory | undefined>;
  abstract findById(id: string): Promise<RankingCategory | undefined>;
  abstract findAll(
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: RankingCategory[]; pagination: PaginationResponse }>;
  abstract findAllByUser(
    user: User,
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: RankingCategory[]; pagination: PaginationResponse }>;
  abstract findByName(name: string): Promise<RankingCategory | undefined>;
  abstract findBySlug(slug: string): Promise<RankingCategory | undefined>;
  abstract findResidencesByCategory(
    rankingCategoryId: string,
    query: FetchResidencesByCategoryQuery
  ): Promise<any>;
  abstract update(id: string, data: Partial<RankingCategory>): Promise<RankingCategory | undefined>;
  abstract softDelete(id: string): Promise<void>;
  abstract assignWeights(
    id: string,
    data: { rankingCriteriaId: string; weight: number }[]
  ): Promise<void>;
}
