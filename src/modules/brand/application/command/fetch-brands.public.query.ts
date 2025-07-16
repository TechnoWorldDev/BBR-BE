import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { BrandStatus } from '../../domain/brand-status.enum';

export class FetchBrandsPublicQuery extends BaseFetchQuery {
  status?: BrandStatus[];
  brandTypeId?: string[];
  withResidences?: boolean;

  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: BrandStatus[],
    withResidences?: boolean,
    brandTypeId?: string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);

    this.status = status;
    this.brandTypeId = brandTypeId;
    this.withResidences = withResidences;
  }
}
