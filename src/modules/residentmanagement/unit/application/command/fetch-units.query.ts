import { BaseFetchQuery } from '../../../../../shared/query/base-fetch.query';
import { UnitStatusEnum } from '../../domain/unit-status.enum';

export class FetchUnitsQuery extends BaseFetchQuery {
  unitTypeId?: string[];
  residenceId?: string[];
  status?: UnitStatusEnum[];
  regularPrice?: { gt?: number; lt?: number };
  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?,
    residenceId?: string[],
    unitTypeId?: string[],
    status?: UnitStatusEnum[],
    regularPrice?: { gt?: number; lt?: number }
  ) {
    super(query, page, limit, sortBy, sortOrder);
    this.unitTypeId = unitTypeId;
    this.status = status;
    this.regularPrice = regularPrice;
    this.residenceId = residenceId;
  }
}
