import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchReviewsQuery extends BaseFetchQuery {
  status?: string[];
  residenceId?: string[];
  userId?: string[];
  unitTypeId?: string[];
  companyId?: string;

  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    status?: string[],
    residenceId?: string[],
    userId?: string[],
    unitTypeId?: string[],
    companyId?: string
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
    this.status = status;
    this.residenceId = residenceId;
    this.userId = userId;
    this.unitTypeId = unitTypeId;
    this.companyId = companyId;
  }
}
