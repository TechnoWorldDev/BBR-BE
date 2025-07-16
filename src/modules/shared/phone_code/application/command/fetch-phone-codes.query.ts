import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchPhoneCodesQuery extends BaseFetchQuery {
  constructor(query?: string, page?: number, limit?: number, sortBy?: string, sortOrder?) {
    super(query, page, limit, sortBy, sortOrder);
  }
}
