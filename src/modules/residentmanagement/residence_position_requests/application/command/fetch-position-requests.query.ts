import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

export class FetchPositionRequestsQuery extends BaseFetchQuery {
  status?: ResidencePositionRequestStatusEnum[];
  companyId?: string;

  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: ResidencePositionRequestStatusEnum[],
    companyId?: string
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);

    this.status = status;
    this.companyId = companyId;
  }
}
