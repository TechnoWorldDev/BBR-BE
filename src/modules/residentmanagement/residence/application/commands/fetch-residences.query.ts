import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';

export class FetchResidencesQuery extends BaseFetchQuery {
  status?: ResidenceStatusEnum[];
  developmentStatus?: DevelopmentStatusEnum[];
  cityId?: string[];
  countryId?: string[];
  brandId?: string[];
  address?: string[];
  continentId?: string[];
  companyId?:  string[];

  constructor(
    searchQuery?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: ResidenceStatusEnum[],
    developmentStatus?: DevelopmentStatusEnum[],
    cityId?: string[],
    countryId?: string[],
    brandId?: string[],
    address?: string[],
    continentId?: string[],
    companyId?:  string[]
  ) {
    super(searchQuery, page, limit, sortBy, sortOrder);
    this.status = status;
    this.developmentStatus = developmentStatus;
    this.cityId = cityId;
    this.countryId = countryId;
    this.brandId = brandId;
    this.address = address;
    this.continentId = continentId;
    this.companyId = companyId;
  }
}
