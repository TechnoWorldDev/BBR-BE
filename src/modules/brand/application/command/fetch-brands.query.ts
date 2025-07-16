import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { BrandStatus } from '../../domain/brand-status.enum';

export class FetchBrandsQuery extends BaseFetchQuery {
  status?: BrandStatus[];
  brandTypeId?: string[];
  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: BrandStatus[],
    brandTypeId?: string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);

    this.status = status;
    this.brandTypeId = brandTypeId;
  }
}
