import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchLifestyleQuery extends BaseFetchQuery {
  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
  }
}
