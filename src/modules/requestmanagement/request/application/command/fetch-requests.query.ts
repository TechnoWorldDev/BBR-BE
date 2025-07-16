import { RequestTypeEnum } from '../../domain/request-type.enum';
import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';

export class FetchRequestsQuery extends BaseFetchQuery {
  leadId?: string[];
  type?: string[];
  status?: string[];
  companyId?: string;

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    leadId?: string[],
    type?: string[],
    status?: string[],
    companyId?: string
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.leadId = leadId;
    this.type = type;
    this.status = status;
    this.companyId = companyId;
  }
}
