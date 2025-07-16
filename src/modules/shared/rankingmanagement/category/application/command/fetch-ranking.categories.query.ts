import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from '../../../../../../shared/query/base-fetch.query';
import { RankingCategoryStatus } from '../../domain/ranking-category-status.enum';

export class FetchRankingCategoriesQuery extends BaseFetchQuery {
  status?: RankingCategoryStatus[];
  categoryTypeId?: string[];

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: RankingCategoryStatus[],
    categoryTypeId?: string[]
  ) {
    super(query, page, limit, sortBy, sortOrder);

    this.status = status;
    this.categoryTypeId = categoryTypeId;
  }
}
