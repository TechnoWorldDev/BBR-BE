import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from '../../../../../../shared/query/base-fetch.query';

export class FetchRankingCategoryTypesQuery extends BaseFetchQuery {
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection
  ) {
    super(query, page, limit, sortBy, sortOrder);
  }
}
