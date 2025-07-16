import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchFavoritesQuery extends BaseFetchQuery {
  entityType?: string[];
  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    entityType?: string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
    this.entityType = entityType;
  }
}
