import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';


export class FetchCareerContactFormsQuery extends BaseFetchQuery {
  position?: string;
  websiteURL?: string;
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    position?: string,
    websiteURL?: string,
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.position = position;
    this.websiteURL = websiteURL;
  }
}
