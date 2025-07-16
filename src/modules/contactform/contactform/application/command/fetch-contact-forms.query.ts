import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';

export class FetchContactFormsQuery extends BaseFetchQuery {
  type?: string;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    type?: string,
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.type = type;
  }
}
