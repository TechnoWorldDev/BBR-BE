import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { BillingProductTypeEnum } from 'src/shared/types/product-type.enum';

export class FetchTransactionsQuery extends BaseFetchQuery {
  userId: string;
  status?: string[];
  type?: BillingProductTypeEnum[];
  constructor(
    userId: string,
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    type?: BillingProductTypeEnum[],
    status?: string[]
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.type = type;
    this.status = status;
    this.userId = userId;
  }
}
