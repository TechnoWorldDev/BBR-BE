import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';

export class FetchResidencesUnassignedToCategoryQuery extends BaseFetchQuery {
  cityId?: string[];
  countryId?: string[];
  brandId?: string[];
  continentId?: string[];

  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    cityId?: string[],
    countryId?: string[],
    brandId?: string[],
    continentId?: string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
    this.cityId = cityId;
    this.countryId = countryId;
    this.brandId = brandId;
    this.continentId = continentId;
  }
}
