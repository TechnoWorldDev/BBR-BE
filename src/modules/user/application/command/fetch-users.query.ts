import { OrderByDirection } from 'objection';
import { BaseFetchQuery } from 'src/shared/query/base-fetch.query';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

export class FetchUsersQuery extends BaseFetchQuery {
  roleId?: string[];
  status?: UserStatusEnum[];

  constructor(
    query?: string,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: OrderByDirection,
    status?: UserStatusEnum[],
    roleId?: string[]
  ) {
    super(query, page, limit, sortBy, sortOrder);

    this.roleId = roleId;
    this.status = status;
  }
}
