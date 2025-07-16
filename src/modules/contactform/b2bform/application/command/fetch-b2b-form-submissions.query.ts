import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';
import { B2BFormSubmissionStatus } from '../../domain/b2b-form-submission-status.enum';

export class FetchB2BFormSubmissionsQuery extends BaseFetchQuery {
  status?: string;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    status?: string,
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.status = status;
  }
}
