import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchResidencesByCategoryQuery extends BaseFetchQuery {
  countryId?: string[];
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    countryId?: string[]
  ) {
    super(query, page, limit, sortBy, sortOrder);

    this.countryId = countryId;
  }
}
